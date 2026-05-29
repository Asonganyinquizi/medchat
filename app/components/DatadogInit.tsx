'use client';

import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

let initialized = false;

export default function DatadogInit() {
  useEffect(() => {
    if (initialized) return;
    initialized = true;

    datadogRum.init({
      applicationId: '419947f4-8e4e-4e30-a97d-a476b3df85a9',
      clientToken: 'pubd99550e7fdb656e6c780f0533ed3831c',
      site: 'us5.datadoghq.com',
      service: 'medchat',
      env: process.env.NODE_ENV,
      version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackResources: true,
      trackUserInteractions: true,
      trackLongTasks: true,
    });

    datadogRum.startSessionReplayRecording();
  }, []);

  return null;
}
