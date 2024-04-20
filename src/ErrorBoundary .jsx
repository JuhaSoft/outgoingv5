import React, { Component } from 'react';
import { toast } from 'react-toastify'; // Anda harus memasang library react-toastify terlebih dahulu

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    toast.error('Oops! Something went wrong.'); // Menampilkan pesan toast saat error terjadi
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>; // Menampilkan fallback UI jika terjadi error
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
