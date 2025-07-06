'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from 'primereact/card';
import Link from 'next/link';

function DebugUrlForm() {
  const searchParams = useSearchParams();

  // Get all URL parameters
  const allParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    allParams[key] = value;
  });

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-0 m-0">
            URL Parameter Debug
          </h1>
          <p className="text-surface-600 dark:text-surface-400 m-0">
            This page shows all URL parameters for debugging confirmation links
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Current URL Parameters:</h3>
          {Object.keys(allParams).length === 0 ? (
            <p className="text-surface-500 italic">No URL parameters found</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(allParams).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-column gap-1 p-3 border border-surface-300 rounded"
                >
                  <strong className="text-surface-900 dark:text-surface-0">{key}:</strong>
                  <code className="text-sm bg-surface-100 dark:bg-surface-800 p-2 rounded break-all">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Expected Parameters for Confirmation:</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <strong>PKCE Flow (Recommended):</strong>
              <ul className="mt-2 ml-4 list-disc">
                <li>
                  <code>token_hash</code>: The confirmation token
                </li>
                <li>
                  <code>type</code>: "signup" for email confirmation
                </li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
              <strong>JWT Flow:</strong>
              <ul className="mt-2 ml-4 list-disc">
                <li>
                  <code>access_token</code>: JWT access token
                </li>
                <li>
                  <code>refresh_token</code>: JWT refresh token
                </li>
              </ul>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <strong>Legacy Flow:</strong>
              <ul className="mt-2 ml-4 list-disc">
                <li>
                  <code>token</code>: Confirmation token
                </li>
                <li>
                  <code>type</code>: "signup" for email confirmation
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <Link
            href="/auth/confirm"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go to Confirmation Page
          </Link>
          <br />
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function DebugUrlPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DebugUrlForm />
    </Suspense>
  );
}
