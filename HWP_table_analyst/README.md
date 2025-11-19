# HWP Table Analyst

A web application that allows you to visualize and analyze tables from HWP (한글) files. Built with React, TypeScript, and hwp.js.

## Features

- Upload and parse HWP files
- View tables in a clean, modern interface
- Interactive table selection
- Data visualization with bar and pie charts
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kimmaru/hwp-table-analyst.git
cd hwp-table-analyst
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Usage

1. Open the application in your web browser
2. Click the upload area or drag and drop an HWP file
3. Once the file is uploaded, you'll see a list of tables on the left side
4. Click on a table to view its contents
5. Use the right panel to:
   - Select different chart types (bar or pie)
   - Choose which column to visualize
   - Interact with the charts (hover for details, click legend items to toggle)

## Development

The project is built with:
- React 18
- TypeScript
- Material-UI
- Recharts
- hwp.js

### Project Structure

```
src/
  ├── components/
  │   ├── FileUploader.tsx    # Handles HWP file uploads
  │   ├── TableVisualizer.tsx # Displays table contents
  │   └── DataVisualizer.tsx  # Shows data visualizations
  ├── types.ts                # TypeScript type definitions
  ├── App.tsx                 # Main application component
  └── index.tsx              # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [hwp.js](https://github.com/hahnlee/hwp.js) for HWP file parsing
- [Material-UI](https://mui.com/) for the UI components
- [Recharts](https://recharts.org/) for the data visualization
