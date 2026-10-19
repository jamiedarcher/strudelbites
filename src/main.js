/**
 * @file Entry point: loads global styles and mounts the Svelte app.
 */
import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

/** The running app instance. */
export const appInstance = mount(App, { target: document.getElementById('app') });
