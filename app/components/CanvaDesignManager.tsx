// app/components/CanvaDesignManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface CanvaDesign {
  id: string;
  title: string;
  type: string;
  url: string;
  thumbnail?: {
    url: string;
  };
}

interface PublishOptions {
  targetDomain: 'bettadayz.shop' | 'bettadayz.store' | 'both';
  publishPath: string;
  exportFormat: 'png' | 'jpg' | 'pdf' | 'svg';
  exportQuality: 'low' | 'medium' | 'high';
}

export default function CanvaDesignManager() {
  const [designs, setDesigns] = useState<CanvaDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<CanvaDesign | null>(null);
  const [publishOptions, setPublishOptions] = useState<PublishOptions>({
    targetDomain: 'both',
    publishPath: '/assets/images/',
    exportFormat: 'png',
    exportQuality: 'high',
  });
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message?: string;
    urls?: Array<{ domain: string; url: string }>;
  } | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    checkCanvaConnection();
  }, []);

  useEffect(() => {
    if (connected) {
      fetchDesigns();
    }
  }, [connected]);

  const checkCanvaConnection = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: credentials } = await supabase
        .from('canva_credentials')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setConnected(!!credentials);
      setLoading(false);
    } catch (error) {
      console.error('Error checking Canva connection:', error);
      setLoading(false);
    }
  };

  const connectCanva = () => {
    window.location.href = '/api/canva/auth';
  };

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/canva/designs');
      const data = await response.json();

      if (response.ok) {
        setDesigns(data.items || []);
      } else {
        console.error('Failed to fetch designs:', data.error);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedDesign) return;

    try {
      setPublishing(true);
      setPublishResult(null);

      const response = await fetch('/api/canva/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designId: selectedDesign.id,
          targetDomain: publishOptions.targetDomain,
          publishPath: publishOptions.publishPath,
          exportOptions: {
            format: publishOptions.exportFormat,
            quality: publishOptions.exportQuality,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPublishResult({
          success: true,
          message: 'Design published successfully!',
          urls: data.urls,
        });
      } else {
        setPublishResult({
          success: false,
          message: data.error || 'Failed to publish design',
        });
      }
    } catch (error) {
      console.error('Error publishing design:', error);
      setPublishResult({
        success: false,
        message: 'An error occurred while publishing',
      });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Canva</h2>
        <p className="text-gray-600 mb-6">
          Connect your Canva account to manage and publish designs to your domains.
        </p>
        <button
          onClick={connectCanva}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Connect Canva Account
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Canva Design Manager</h2>
            <p className="text-gray-600 mt-1">
              Edit designs locally, sync to Supabase, and publish to your domains
            </p>
          </div>
          <button
            onClick={fetchDesigns}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh Designs
          </button>
        </div>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <div
            key={design.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedDesign(design)}
          >
            {design.thumbnail && (
              <img
                src={design.thumbnail.url}
                alt={design.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 truncate">{design.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{design.type}</p>
              <a
                href={design.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                Edit in Canva →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
      {selectedDesign && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Publish Design
            </h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">{selectedDesign.title}</h4>
              {selectedDesign.thumbnail && (
                <img
                  src={selectedDesign.thumbnail.url}
                  alt={selectedDesign.title}
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              )}
            </div>

            <div className="space-y-4">
              {/* Target Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Domain(s)
                </label>
                <select
                  value={publishOptions.targetDomain}
                  onChange={(e) =>
                    setPublishOptions({
                      ...publishOptions,
                      targetDomain: e.target.value as PublishOptions['targetDomain'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="bettadayz.shop">bettadayz.shop</option>
                  <option value="bettadayz.store">bettadayz.store</option>
                  <option value="both">Both Domains</option>
                </select>
              </div>

              {/* Publish Path */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Path
                </label>
                <input
                  type="text"
                  value={publishOptions.publishPath}
                  onChange={(e) =>
                    setPublishOptions({
                      ...publishOptions,
                      publishPath: e.target.value,
                    })
                  }
                  placeholder="/assets/images/hero.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={publishOptions.exportFormat}
                  onChange={(e) =>
                    setPublishOptions({
                      ...publishOptions,
                      exportFormat: e.target.value as PublishOptions['exportFormat'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="pdf">PDF</option>
                  <option value="svg">SVG</option>
                </select>
              </div>

              {/* Export Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Quality
                </label>
                <select
                  value={publishOptions.exportQuality}
                  onChange={(e) =>
                    setPublishOptions({
                      ...publishOptions,
                      exportQuality: e.target.value as PublishOptions['exportQuality'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Publish Result */}
            {publishResult && (
              <div
                className={`mt-6 p-4 rounded-lg ${
                  publishResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p
                  className={`font-medium ${
                    publishResult.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {publishResult.message}
                </p>
                {publishResult.urls && (
                  <div className="mt-2 space-y-1">
                    {publishResult.urls.map((url, index) => (
                      <a
                        key={index}
                        href={url.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-700"
                      >
                        {url.domain}: {url.url}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDesign(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? 'Publishing...' : 'Publish to Domain(s)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
