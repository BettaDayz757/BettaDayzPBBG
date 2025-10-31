// lib/canva/client.ts
// Canva API Client for Local → Supabase → Domain Publishing Workflow

import { createClient } from '@supabase/supabase-js';

export interface CanvaConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  apiBaseUrl: string;
}

export interface CanvaDesign {
  id: string;
  title: string;
  type: string;
  url: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CanvaExportOptions {
  format: 'png' | 'jpg' | 'pdf' | 'svg' | 'mp4' | 'gif';
  quality?: 'low' | 'medium' | 'high';
  pages?: number[];
}

export interface PublishWorkflowOptions {
  designId: string;
  targetDomain: 'bettadayz.shop' | 'bettadayz.store' | 'both';
  publishPath: string;
  exportOptions: CanvaExportOptions;
}

export class CanvaClient {
  private config: CanvaConfig;
  private accessToken: string | null = null;
  private supabase: ReturnType<typeof createClient>;

  constructor(config: CanvaConfig) {
    this.config = config;
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      ...(state && { state }),
    });

    return `${this.config.apiBaseUrl.replace('/rest/v1', '')}/api/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await fetch(`${this.config.apiBaseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code for token: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    
    return data;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await fetch(`${this.config.apiBaseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    
    return data;
  }

  /**
   * Set access token manually
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * List user's Canva designs
   */
  async listDesigns(options?: {
    limit?: number;
    continuation?: string;
  }): Promise<{
    items: CanvaDesign[];
    continuation?: string;
  }> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.continuation) params.append('continuation', options.continuation);

    const response = await fetch(
      `${this.config.apiBaseUrl}/designs?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list designs: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get specific design details
   */
  async getDesign(designId: string): Promise<CanvaDesign> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(
      `${this.config.apiBaseUrl}/designs/${designId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get design: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Export design with specified options
   */
  async exportDesign(
    designId: string,
    options: CanvaExportOptions
  ): Promise<{
    job_id: string;
    status: string;
  }> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(
      `${this.config.apiBaseUrl}/designs/${designId}/export`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: options.format,
          ...(options.quality && { quality: options.quality }),
          ...(options.pages && { pages: options.pages }),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to export design: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Check export job status
   */
  async getExportStatus(jobId: string): Promise<{
    job_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    urls?: Array<{ url: string; page?: number }>;
    error?: string;
  }> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(
      `${this.config.apiBaseUrl}/export/jobs/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get export status: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Complete workflow: Export from Canva → Upload to Supabase → Deploy to Domain(s)
   */
  async publishWorkflow(options: PublishWorkflowOptions): Promise<{
    success: boolean;
    urls: Array<{ domain: string; url: string }>;
    error?: string;
  }> {
    try {
      // Step 1: Get design details
      const design = await this.getDesign(options.designId);

      // Step 2: Start export job
      const exportJob = await this.exportDesign(
        options.designId,
        options.exportOptions
      );

      // Step 3: Poll for export completion
      let exportResult;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes with 5-second intervals

      while (attempts < maxAttempts) {
        exportResult = await this.getExportStatus(exportJob.job_id);
        
        if (exportResult.status === 'completed') {
          break;
        } else if (exportResult.status === 'failed') {
          throw new Error(exportResult.error || 'Export failed');
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;
      }

      if (!exportResult || exportResult.status !== 'completed' || !exportResult.urls) {
        throw new Error('Export timed out or failed');
      }

      // Step 4: Download exported file(s)
      const deployedUrls: Array<{ domain: string; url: string }> = [];

      for (const exportUrl of exportResult.urls) {
        const fileResponse = await fetch(exportUrl.url);
        const fileBlob = await fileResponse.blob();
        const fileName = `${options.designId}_${Date.now()}.${options.exportOptions.format}`;

        // Step 5: Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await this.supabase
          .storage
          .from('canva-assets')
          .upload(`designs/${fileName}`, fileBlob, {
            contentType: fileBlob.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
        }

        // Step 6: Get public URL
        const { data: publicUrl } = this.supabase
          .storage
          .from('canva-assets')
          .getPublicUrl(uploadData.path);

        // Step 7: Save to canva_designs table
        const domains = options.targetDomain === 'both' 
          ? ['bettadayz.shop', 'bettadayz.store'] 
          : [options.targetDomain];

        for (const domain of domains) {
          // Insert into canva_domain_assets
          const { error: insertError } = await this.supabase
            .from('canva_domain_assets')
            .insert({
              design_id: options.designId,
              domain,
              asset_path: options.publishPath,
              asset_type: options.exportOptions.format === 'mp4' ? 'video' : 'image',
              cdn_url: publicUrl.publicUrl,
              file_size_bytes: fileBlob.size,
            });

          if (insertError) {
            console.error(`Failed to insert domain asset for ${domain}:`, insertError);
          }

          deployedUrls.push({
            domain,
            url: publicUrl.publicUrl,
          });
        }

        // Log publish history
        await this.supabase.from('canva_publish_history').insert({
          design_id: options.designId,
          publish_type: 'publish',
          target_domain: options.targetDomain,
          publish_url: publicUrl.publicUrl,
          export_format: options.exportOptions.format,
          export_quality: options.exportOptions.quality || 'high',
          file_size_bytes: fileBlob.size,
          file_url: publicUrl.publicUrl,
          workflow_status: 'completed',
          completed_at: new Date().toISOString(),
        });
      }

      return {
        success: true,
        urls: deployedUrls,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Log failed publish attempt
      await this.supabase.from('canva_publish_history').insert({
        design_id: options.designId,
        publish_type: 'publish',
        target_domain: options.targetDomain,
        workflow_status: 'failed',
        error_message: errorMessage,
      });

      return {
        success: false,
        urls: [],
        error: errorMessage,
      };
    }
  }

  /**
   * Sync design metadata to Supabase
   */
  async syncDesignToSupabase(
    designId: string,
    userId: string,
    businessId?: string
  ): Promise<void> {
    const design = await this.getDesign(designId);

    const { error } = await this.supabase.from('canva_designs').upsert({
      canva_design_id: design.id,
      user_id: userId,
      business_id: businessId,
      design_title: design.title,
      design_type: design.type,
      design_url: design.url,
      thumbnail_url: design.thumbnail?.url,
      last_edited_at: design.updated_at,
      status: 'ready',
    }, {
      onConflict: 'canva_design_id',
    });

    if (error) {
      throw new Error(`Failed to sync design to Supabase: ${error.message}`);
    }
  }
}

/**
 * Create a configured Canva client instance
 */
export function createCanvaClient(): CanvaClient {
  const config: CanvaConfig = {
    clientId: process.env.CANVA_CLIENT_ID || '',
    clientSecret: process.env.CANVA_CLIENT_SECRET || '',
    redirectUri: process.env.CANVA_REDIRECT_URI || '',
    scopes: (process.env.CANVA_SCOPES || '').split(','),
    apiBaseUrl: process.env.CANVA_API_BASE_URL || '',
  };

  return new CanvaClient(config);
}
