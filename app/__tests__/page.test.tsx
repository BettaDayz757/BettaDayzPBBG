import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock window object for client-side code
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'bettadayz.shop',
  },
  writable: true,
});

describe('Home Page', () => {
  it('should render the page title', () => {
    render(<Home />);
    
    expect(screen.getByText(/Build Your Empire in/i)).toBeInTheDocument();
  });

  it('should display BettaDayzPBBG branding', () => {
    render(<Home />);
    
    // Look for the specific branding element
    expect(screen.getByText('BettaDayz')).toBeInTheDocument();
    expect(screen.getByText('PBBG')).toBeInTheDocument();
  });

  it('should show Norfolk, VA in the main heading', () => {
    render(<Home />);
    
    // More specific query for the yellow heading text
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Norfolk, VA');
  });

  it('should have a Play Now button', () => {
    render(<Home />);
    
    const playButton = screen.getByRole('button', { name: /Play Now/i });
    expect(playButton).toBeInTheDocument();
  });

  it('should display game inspiration tags', () => {
    render(<Home />);
    
    expect(screen.getByText(/IMVU-Style Social/i)).toBeInTheDocument();
    expect(screen.getByText(/BitLife Life Sim/i)).toBeInTheDocument();
    expect(screen.getByText(/Torn.com Competition/i)).toBeInTheDocument();
  });

  it('should show game features section', () => {
    render(<Home />);
    
    expect(screen.getByText('Game Features')).toBeInTheDocument();
  });
});
