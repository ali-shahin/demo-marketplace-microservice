# Image Optimization Service

A Node.js microservice for image upload and optimization (resize, compress, etc.) for the marketplace platform.

## Features

- Upload images via `/upload` endpoint (multipart/form-data, field: `image`)
- (Next steps) Resize, compress, and optimize images using Sharp
- Stores images in the `uploads/` directory

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the service:
   ```bash
   npm run dev
   ```
3. Upload an image:
   - POST to `http://localhost:3001/upload` with form-data: `image=<your file>`

## Roadmap

- [x] Project scaffold and upload endpoint
- [ ] Image processing (resize, compress, optimize)
- [ ] Return optimized image URLs and metadata
- [ ] Error handling and validation
- [ ] API documentation
- [ ] Tests
