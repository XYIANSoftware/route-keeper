import React from 'react';

export default function DashboardPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {/* TODO: Current drive, timer, start/stop buttons */}
      <section>{/* DriveCard */}</section>
      {/* TODO: Quick add stop */}
      <section>{/* StopForm */}</section>
      {/* TODO: List of past drives */}
      <section>{/* DriveList */}</section>
    </main>
  );
}
