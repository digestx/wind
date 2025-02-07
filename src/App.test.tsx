import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.js';

describe('App Component', () => {
  it('renders form templates heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/form templates/i);
    expect(headingElement).toBeInTheDocument();
  });
});
