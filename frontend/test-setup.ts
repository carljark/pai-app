import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { ResourceLoader } from '@angular/compiler';
import { afterEach } from 'vitest';

class MockResourceLoader extends ResourceLoader {
  get(url: string): Promise<string> {
    return Promise.resolve('<div>Mocked Template</div>');
  }
}

try {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
} catch (e) {}

TestBed.configureCompiler({
  providers: [
    { provide: ResourceLoader, useClass: MockResourceLoader }
  ]
});

global.self = global as any;

afterEach(() => {
  TestBed.resetTestingModule();
});
