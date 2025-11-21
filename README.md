# Caffe Bar Art

A modern, responsive website for Caffe Bar Art - a cozy coffee shop and bar located in Žitište, Serbia, owned by the Milinović family.

## About the Project

Caffe Bar Art is a static website showcasing a local coffee shop and bar that has been successfully operating for many years. The website provides visitors with information about the establishment, drinks menu, photo gallery, and contact details.

### Key Features

- **Responsive Design**: Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean and elegant design with smooth animations and transitions
- **Performance Optimized**: Lazy loading for images, throttled scroll events, and optimized resource loading
- **Component-Based Architecture**: Reusable header and footer components loaded dynamically
- **Smooth Scrolling**: Custom smooth scroll implementation for better user experience
- **Mobile Navigation**: Touch-friendly mobile menu with proper scroll position handling
- **Gallery Section**: Beautiful image gallery with lazy loading animations
- **Drinks Menu**: Comprehensive menu showcasing spirits, beers, cold drinks, and hot beverages

## Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
  - Custom variables for consistent theming
  - Modular CSS architecture (separate files for different components)
  - CSS animations and transitions
  - Responsive design using media queries
- **Vanilla JavaScript**: No frameworks, pure JavaScript for:
  - Dynamic component loading
  - Mobile menu functionality
  - Smooth scrolling
  - Intersection Observer API for scroll animations and lazy loading
  - Performance optimizations (throttling)
- **Font Awesome**: Icon library for visual elements
- **Google Fonts**: Playfair Display and Lora fonts for elegant typography

## Project Structure

```
Caffe_art/
├── assets/
│   ├── css/
│   │   ├── vendor/
│   │   │   └── normalize.css      # CSS reset
│   │   ├── variables.css          # CSS custom properties
│   │   ├── base.css              # Base styles
│   │   ├── layout.css            # Layout utilities
│   │   ├── header.css            # Header styles
│   │   ├── footer.css            # Footer styles
│   │   ├── menu.css              # Drinks menu styles
│   │   ├── gallery.css           # Gallery styles
│   │   ├── about.css             # About section styles
│   │   ├── animations.css        # Animation definitions
│   │   ├── responsive.css        # Media queries
│   │   ├── icons.css             # Icon styles
│   │   └── main.css              # Main CSS imports
│   ├── js/
│   │   └── main.js               # Main JavaScript file
│   └── img/
│       ├── logo/                 # Logo images
│       └── gallery/              # Gallery images
├── components/
│   ├── header.html              # Reusable header component
│   └── footer.html              # Reusable footer component
├── index.html                   # Home page
├── bar.html                     # Drinks menu page
├── gallery.html                 # Photo gallery page
├── contact.html                 # About/Contact page
└── README.md                    # Project documentation
```

## Pages

1. **Home** (`index.html`) - Landing page with hero section
2. **Bar** (`bar.html`) - Drinks menu categorized by type (spirits, beers, hot/cold drinks)
3. **Gallery** (`gallery.html`) - Photo gallery showcasing drinks and ambiance
4. **Contact** (`contact.html`) - About us section with key highlights and contact information

## Features in Detail

### Performance Optimization
- Preconnect and DNS prefetch for external resources (Google Fonts, CDNs)
- Lazy loading for gallery images using native HTML attributes
- Intersection Observer API for efficient scroll-triggered animations
- Throttled scroll events to reduce performance overhead
- Background image lazy loading

### Animations
- Fade-in-up animations for content sections
- Staggered gallery item animations
- Smooth scroll behavior with custom easing function
- Sticky navigation on scroll

### Mobile-First Approach
- Responsive grid layouts
- Touch-optimized mobile menu
- Proper handling of scroll position when opening/closing mobile menu
- Viewport meta tag for proper mobile rendering

## Browser Support

The website is compatible with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/petarplecas/Caffe_art.git
```

2. Navigate to the project directory:
```bash
cd Caffe_art
```

3. Open `index.html` in your browser or use a local development server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

4. Access the website at `http://localhost:8000`

## Customization

### Updating Colors
Modify the CSS custom properties in `assets/css/variables.css` to change the color scheme.

### Adding Gallery Images
1. Add images to `assets/img/gallery/`
2. Update `gallery.html` with new image references
3. Use the `loading="lazy"` attribute for performance

### Modifying the Menu
Edit the drinks menu in `bar.html` by adding or removing items from the menu cards.

## Future Enhancements

Potential improvements for future versions:
- [ ] Add online reservation system
- [ ] Integrate Google Maps for location
- [ ] Add social media feed integration
- [ ] Implement contact form with backend
- [ ] Add multi-language support (Serbian/English)
- [ ] Create CMS for easier content management
- [ ] Add blog section for news and events

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is created for Caffe Bar Art. All rights reserved.

## Contact

For more information about Caffe Bar Art, please visit our website or contact us directly.

---

Built with ☕ by the Caffe Bar Art team