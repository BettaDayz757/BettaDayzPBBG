import { WebSocket } from 'ws';
import { EventEmitter } from 'events';

class BitcoinPaymentMonitor extends EventEmitter {
  constructor(address) {
    super();
    this.address = address;
    this.websocket = null;
    this.pendingTransactions = new Map();
  }

  start() {
    // Connect to Blockchain.info WebSocket API
    this.websocket = new WebSocket('wss://ws.blockchain.info/inv');

    this.websocket.on('open', () => {
      // Subscribe to address
      this.websocket.send(
        JSON.stringify({
          op: 'addr_sub',
          addr: this.address,
        }),
      );
    });

    this.websocket.on('message', (data) => {
      const tx = JSON.parse(data);
      this.handleTransaction(tx);
    });

    // Monitor confirmations for pending transactions
    setInterval(() => this.checkConfirmations(), 60000); // Every minute
  }

  async handleTransaction(tx) {
    if (tx.op === 'utx') {
      // New unconfirmed transaction
      this.pendingTransactions.set(tx.x.hash, {
        hash: tx.x.hash,
        amount:
          tx.x.out.reduce((acc, output) => {
            if (output.addr === this.address) {
              return acc + output.value;
            }

            return acc;
          }, 0) / 100000000, // Convert satoshis to BTC
        confirmations: 0,
        timestamp: Date.now(),
      });

      this.emit('newTransaction', {
        txHash: tx.x.hash,
        amount: this.pendingTransactions.get(tx.x.hash).amount,
      });
    }
  }

  async checkConfirmations() {
    for (const [hash, tx] of this.pendingTransactions) {
      try {
        const response = await fetch(`https://blockchain.info/rawtx/${hash}`);
        const txData = await response.json();

        if (txData.block_height) {
          const confirmations = txData.block_height ? txData.confirmations : 0;
          this.pendingTransactions.set(hash, {
            ...tx,
            confirmations,
          });

          if (confirmations >= 2) {
            this.emit('confirmed', {
              txHash: hash,
              amount: tx.amount,
              confirmations,
            });
            this.pendingTransactions.delete(hash);
          }
        }
      } catch (error) {
        console.error(`Error checking confirmations for ${hash}:`, error);
      }
    }
  }

  stop() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}

export const bitcoinMonitor = new BitcoinPaymentMonitor(process.env.BITCOIN_ADDRESS);

// Start monitoring on server start
bitcoinMonitor.start();

// Handle new transactions
bitcoinMonitor.on('newTransaction', async ({ txHash, amount }) => {
  console.log(`New transaction received: ${txHash} for ${amount} BTC`);

  // Update transaction in database
});

// Handle confirmed transactions
bitcoinMonitor.on('confirmed', async ({ txHash, amount }) => {
  console.log(`Transaction ${txHash} confirmed with ${amount} BTC`);

  // Update user's balance and unlock purchased items
});
