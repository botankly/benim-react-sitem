import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

describe('Navbar Bileşeni', () => {
  const defaultProps = {
    theme: 'dark',
    toggleTheme: vi.fn(),
    setIsContactOpen: vi.fn(),
  };

  it('Navbar elemanlarını doğru şekilde render etmelidir', () => {
    render(<Navbar {...defaultProps} />);

    // Logo kontrolü
    expect(screen.getByText('Botan Külay')).toBeInTheDocument();

    // Linklerin varlık kontrolü
    expect(screen.getByText('Hakkımda')).toBeInTheDocument();
    expect(screen.getByText('Projelerim')).toBeInTheDocument();
    expect(screen.getByText('Mobil')).toBeInTheDocument();
    expect(screen.getByText('Kodlar')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('İletişim')).toBeInTheDocument();
  });

  it('Karanlık temadayken tema butonunun içeriğini ve aria-label değerini doğru göstermelidir', () => {
    render(<Navbar {...defaultProps} theme="dark" />);

    const button = screen.getByRole('button', { name: 'Açık temaya geç' });
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('☀️');
  });

  it('Açık temadayken tema butonunun içeriğini ve aria-label değerini doğru göstermelidir', () => {
    render(<Navbar {...defaultProps} theme="light" />);

    const button = screen.getByRole('button', { name: 'Koyu temaya geç' });
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('🌙');
  });

  it('Tema butonuna basıldığında toggleTheme fonksiyonunu çağırmalıdır', () => {
    const toggleThemeMock = vi.fn();
    render(<Navbar {...defaultProps} toggleTheme={toggleThemeMock} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  it('İletişim linkine tıklandığında setIsContactOpen(true) fonksiyonunu çağırmalıdır', () => {
    const setIsContactOpenMock = vi.fn();
    render(<Navbar {...defaultProps} setIsContactOpen={setIsContactOpenMock} />);

    const contactLink = screen.getByText('İletişim');
    fireEvent.click(contactLink);

    expect(setIsContactOpenMock).toHaveBeenCalledWith(true);
  });
});
