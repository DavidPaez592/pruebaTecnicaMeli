import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGallery } from './ProductGallery';

describe('ProductGallery', () => {
  const mockPictures = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];
  const mockTitle = 'Apple iPhone 14 - Blanco estelar';

  it('renderiza correctamente con imágenes', () => {
    render(<ProductGallery pictures={mockPictures} title={mockTitle} />);
    
    const mainImage = screen.getByAltText(mockTitle);
    expect(mainImage).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay imágenes', () => {
    render(<ProductGallery pictures={[]} title={mockTitle} />);
    
    expect(screen.getByText('Sin imagen disponible')).toBeInTheDocument();
  });

  it('renderiza todas las miniaturas', () => {
    render(<ProductGallery pictures={mockPictures} title={mockTitle} />);
    
    const thumbnails = screen.getAllByRole('button');
    expect(thumbnails).toHaveLength(mockPictures.length);
  });

  it('cambia la imagen principal al hacer click en una miniatura', () => {
    render(<ProductGallery pictures={mockPictures} title={mockTitle} />);
    
    const thumbnails = screen.getAllByRole('button');
    fireEvent.click(thumbnails[1]);
    
    const mainImage = screen.getByAltText(mockTitle) as HTMLImageElement;
    expect(mainImage.src).toBe(mockPictures[1]);
  });

  it('cambia la imagen principal al hacer hover en una miniatura', () => {
    render(<ProductGallery pictures={mockPictures} title={mockTitle} />);
    
    const thumbnails = screen.getAllByRole('button');
    fireEvent.mouseEnter(thumbnails[2]);
    
    const mainImage = screen.getByAltText(mockTitle) as HTMLImageElement;
    expect(mainImage.src).toBe(mockPictures[2]);
  });

  it('marca la miniatura activa correctamente', () => {
    render(<ProductGallery pictures={mockPictures} title={mockTitle} />);
    
    const thumbnails = screen.getAllByRole('button');
    expect(thumbnails[0]).toHaveClass('product-gallery__thumbnail--active');
    
    fireEvent.click(thumbnails[1]);
    expect(thumbnails[1]).toHaveClass('product-gallery__thumbnail--active');
  });

  it('tiene atributos de accesibilidad correctos', () => {
    render(<ProductGallery pictures={mockPictures} title={mockTitle} />);
    
    const thumbnails = screen.getAllByRole('button');
    thumbnails.forEach((thumb, index) => {
      expect(thumb).toHaveAttribute(
        'aria-label',
        `Ver imagen ${index + 1} de ${mockPictures.length}`
      );
    });
  });

  it('tiene lazy loading en las miniaturas', () => {
    render(<ProductGallery pictures={mockPictures} title={mockTitle} />);
    
    const thumbnailImages = screen.getAllByRole('button').map(
      btn => btn.querySelector('img')
    );
    
    thumbnailImages.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  it('tiene decoding async en las imágenes', () => {
    render(<ProductGallery pictures={mockPictures} title={mockTitle} />);
    
    const mainImage = screen.getByAltText(mockTitle);
    expect(mainImage).toHaveAttribute('decoding', 'async');
  });
});

