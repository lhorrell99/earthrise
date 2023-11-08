``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

### ThreeJS spherical coord system:
- radius: the radius, or the Euclidean distance (straight-line distance) from the point to the origin
- phi: polar angle in radians from the y (up) axis
- theta: equator angle in radians around the y (up) axis

### Positioning assumptions
- moon radius is 1/4 EARTHRADIUS (approx correct)
- moon (and camera) positioned around 10 * earth radius from earth location (correct value 60 * EARTHRADIUS)