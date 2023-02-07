/* A skeleton of this file was written by Duncan Levear in Spring 2023 for CS3333 at Boston College */

export class SVGRenderer {
    constructor(sceneInfo, image) {
        this.scene = sceneInfo;
        this.image = image;
        // clear image all white
        for (let i = 0; i < image.data.length; i++) {
            image.data[i] = 255;
        }
    }

    putPixel(row, col, r, g, b) { 
        //input needs to be in canvas coordinates not world
     
        /*
        Update one pixel in the image array. (r,g,b) are 0-255 color values.
        */
        if (Math.round(row) != row) {
            console.error("Cannot put pixel in fractional row");
            return;
        }
        if (Math.round(col) != col) {
            console.error("Cannot put pixel in fractional col");
            return;
        }
        if (row < 0 || row >= this.image.height) {
            return;
        }
        if (col < 0 || col >= this.image.width) {
            return;
        }

        const index = 4 * (this.image.width * row + col);
        this.image.data[index + 0] = Math.round(r);
        this.image.data[index + 1] = Math.round(g);
        this.image.data[index + 2] = Math.round(b);
        this.image.data[index + 3] = 255;
        // Do not modify the putPixel() function!
    }

    closestPixelTo(x, y) {
        /*
        Return the [row, col] of the canvas pixel closest to the point (x,y) where (x,y) are in world coordinates
        
        Use the convention that the point (minX, minY) is the center of the pixel in row 0 column 0
        The point (maxX, maxY) is the center of the pixel in the last row and the last column
        */
        
        // TODO
        
        var minx, miny, worldWidth, worldHeight
        [minx, miny, worldWidth, worldHeight] = this.scene.viewBox.split(" ")
        minx = Number(minx)
        miny = Number(miny)
        worldWidth = Number(worldWidth)
        worldHeight = Number(worldHeight)
       
        
       
        var colWidth = ((this.scene.width-1)/worldWidth)

        var rowHeight =((this.scene.height-1)/worldHeight)
        
//        console.log("world with and height", worldWidth, worldHeight)
//        console.log("viewbox", [minx, miny, worldWidth, worldHeight])
//
//        console.log("col width and row height", colWidth, rowHeight)
//        console.log("x,y given", x,y)
 //       console.log("pts plotted", (Math.round((y)*rowHeight))-(miny*rowHeight), (Math.round((x)*colWidth))-(minx*colWidth))


        
        return [Math.round((y*rowHeight)-(miny*rowHeight)), Math.round((x*colWidth)-(minx*colWidth))]
    }

    render() {
        /*
        Put all the pixels to light up the elements in scene.elements. 
        It will be necessary to parse the attributes of scene.elements, e.g. converting from strings to numbers.
        */
        for (const e of this.scene.elements) {
            if (e.type === 'point') {
                const x = Number(e.x);
                const y = Number(e.y);
                const color = parseRGB(e.color);
                const alpha = Number(e.opacity) || 1;
                const [row, col] = this.closestPixelTo(x, y);
                this.putPixel(row, col, color[0], color[1], color[2], alpha);
            } else if (e.type === 'line') {
                // TODO
                const x0 = Number(e.x1)
                const y0 = Number(e.y1)
                
                const x1 = Number(e.x2)
                const y1 = Number(e.y2)
                
                const color = parseRGB(e.stroke)
                
                this.DrawLine(x0,y0,x1,y1, color)
                

            } else if (e.type === 'polyline') {
                // TODO
                console.error("Polyline has not been implemented"); // placeholder

            } else if (e.type === 'polygon') {
                const pointsArray = parsePoints(e.points);
                const triangles = triangulate(pointsArray);
                // TODO
                console.error("Polygon has not been implemented");
            }
        }
    }
    
    
   lerp (t0, y0, t1, y1) {
       
        var minx, miny, worldWidth, worldHeight
        [minx, miny, worldWidth, worldHeight] = this.scene.viewBox.split(" ")
        minx = Number(minx)
        miny = Number(miny)
        worldWidth = Number(worldWidth)
        worldHeight = Number(worldHeight)
       
        var colWidth = ((this.scene.width-1)/worldWidth)
        var rowHeight =((this.scene.height-1)/worldHeight)
        
        y0 = Math.round((y0*rowHeight)-(miny*rowHeight))
       y1 = Math.round((y1*rowHeight)-(miny*rowHeight))
        t0 = Math.round((t0*colWidth)-(minx*colWidth))
       t1 = Math.round((t1*colWidth)-(minx*colWidth))

        var values = []
        var y = y0
        for (var t = t0; t <= t1; t++) {
            y += (y1-y0)/(t1-t0)
            values.push(y)
        }

        return values
   }
    
    DrawLine(x0,y0,x1,y1, color) {        
        var minx, miny, worldWidth, worldHeight
        [minx, miny, worldWidth, worldHeight] = this.scene.viewBox.split(" ")
        minx = Number(minx)
        miny = Number(miny)
        worldWidth = Number(worldWidth)
        worldHeight = Number(worldHeight)
       
        var colWidth = ((this.scene.width-1)/worldWidth)
        var rowHeight =((this.scene.height-1)/worldHeight)
        
      

        if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) {
            // Line is horizontal-ish
            // Make sure x0 < x1
            if (x0 > x1) {
                swap(x0, x1)
                swap(y0, y1)
            }
            var ys = this.lerp(x0, y0, x1, y1)
            var [r,g,b] = (color)

            for (var i = 0; i < ys.length; i++) {
                this.putPixel(Math.round((ys[i])), Math.round((x0+i)), r, g, b)
            }
            
        } else {
            // Line is vertical-ish
            // Make sure y0 < y1
            if (y0 > y1) {
                swap(x0, x1)
                swap(y0, y1)    
            }

            var xs = this.lerp(y0, x0, y1, x1)
            console.log("xs", xs)
            var [r,g,b] = (color)

            for (var i = 0; i < xs.length; i++) {
                this.putPixel(Math.round((y0+i)*rowHeight), Math.round(xs[i]*colWidth), r,g,b)
            }
        }
    }
    
    
    
    
    
    
    
}

function parseRGB(colorString) {
    /*
    Return arguments as array [r,g,b] from string like "rgb(255, 0, 127)".
    */
    if (colorString === undefined) {
        // Default value for all colors
        return [0, 0, 0];
    }
    if (colorString[0] === "#") {
        const r = parseInt(colorString[1] + colorString[2], 16);
        const g = parseInt(colorString[3] + colorString[4], 16);
        const b = parseInt(colorString[5] + colorString[6], 16);
        return [r,g,b];
    }
    const parsed = colorString.match(/rgb\(( *\d* *),( *\d* *),( *\d* *)\)/);
    if (parsed.length !== 4) {
        console.error(`Could not parse color string ${colorString}`);
        return [0, 0, 0];
    }
    
    return [Number(parsed[1]), Number(parsed[2]), Number(parsed[3])];
}

function triangulate(points) {
    /*
    Return an array of triangles whose union equals the polygon described by points.
    Assume that points is an array of pairs of numbers. No coordinate transforms are applied.
    Assume that the polygon is non self-intersecting.
    */
    if (points.length <= 3) {
        return [points];
    } else if (points.length === 4) {
        // rearrange into CCW order with points[0] having greatest internal angle
        function f(u,v) {
            // angle between points u and v as if v were the origin
            const ret = Math.atan2(u[1]-v[1],u[0]-v[0]);
            return ret;
        }
        function angleAt(k) {
            const v = points[k];
            const u = points[(k-1+4) % 4];
            const w = points[(k+1) % 4];
            let a = f(w,v) - f(u,v);
            if ( a < 0) {
                return a + 2*Math.PI;
            }
            return a;
        };
        const angles = [angleAt(0), angleAt(1), angleAt(2), angleAt(3)];
        // Check for CCW order
        if (angles[0] + angles[1] + angles[2] + angles[3] > 4*Math.PI) {
            return triangulate([points[3], points[2],points[1],points[0]]);
        }
        // Check for points[0] greatest internal angle
        if (angles[0] !== Math.max(...angles)) {
            return triangulate([points[1], points[2], points[3], points[0]]);
        }
        // If so, the following triangulation is correct
        return [[points[0],points[1],points[2]],[points[0],points[2],points[3]]];
        
   
    } else {
        console.error("Only 3-polygons and 4-polygons supported");
    }
}

function parsePoints(points) {
    /*
    Helper method: convert string like "5,7 100,-2" to array [[5,7], [100,-2]]
    */
    const ret = [];
    const pairs = points.split(" ");
    for (const pair of pairs) {
        if (pair !== "") {
            const [x, y] = pair.split(",");
            ret.push([Number(x), Number(y)]);
        }
    }
    return ret;
}