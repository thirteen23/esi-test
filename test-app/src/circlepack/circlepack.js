import React from 'react';
import { hierarchy, pack } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { annotationCalloutCircle, annotation } from 'd3-svg-annotation';

export default class CirclePack extends React.Component {
    constructor(props) {
        super(props);

        this.drawCirclePack = this.drawCirclePack.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getNumberNumber = this.getNumberNumber.bind(this);
        this.buildCircleData = this.buildCircleData.bind(this);
        this.buildAnnotations = this.buildAnnotations.bind(this);
        this.getQuadrant = this.getQuadrant.bind(this);
    }

    componentDidMount() {
        this.drawCirclePack();
    }

    componentDidUpdate() {
        this.updateCirclePack();
    }

    handleClick(d) {
        this.props.onClick(d.data.param);
    }

    getNumberNumber(n) {
        /**
         * We have to do some parsing here because the data provided
         * as a sample is coming in as a preformatted string
         * (e.g. "1,300") and not catching that was cousing
         * some issues.
         */
        var count;
        if (typeof n === 'string') {
            count = (n === '') ? 0 : parseFloat(n.replace(/,/g, ''));
        } else {
            count = n;
        }
        return count;
    }

    buildCircleData() {
        return hierarchy(this.props.json, (d) => d.data)
            .sum((d) => {
                /**
                 * We need to compensate for zero here some how, so adding a
                 * base number to the count during this calculation makes sense
                 * so zero will render, but it won't effect the scale of the
                 * other circles
                 */
                var zeroAdjust = this.props.zeroAdjust || 10;
                var count = this.getNumberNumber(d.count) + zeroAdjust;

                return count;
            })
            .sort((d) => d.count);
    }

    getQuadrant(d) {
        /**
         * we need to know what quadrant of the parent circle the child is
         * in so that we can make sure things end up in the right place.
         * Create a binary representation and convert it to an int to
         * pass back to the annotation builder.
        */
        var hpos = 0; // 0 left, 1 right
        var vpos = 0; // 0 top, 1 bottom
        if (d.x > d.parent.x) vpos += 1
        if (d.y > d.parent.y) hpos += 1

        return parseInt(hpos + '' + vpos, 2)
    }

    buildAnnotations(d) {
        var dx, dy, padding;
        var countClass;
        var quadrant = this.getQuadrant(d)

        /**
         * Calculate the nearest edge of the parent circle
         * to the child we're generating an annotation for
         */
        var xEdge = d.x - d.parent.x;
        var yEdge = d.y - d.parent.y;
        var dist = Math.sqrt(xEdge * xEdge + yEdge * yEdge)
        var xLoc = (d.parent.x + xEdge * (d.parent.r - 2) / dist) - d.x;
        var yLoc = (d.parent.y + yEdge * (d.parent.r - 2) / dist) - d.y;

        // Add in a bit of offset so the 'elbow' of the line isn't right on the radius of the parent circle
        var edgeOffset = 20;

        // do some magic based on the quadrant of the circle so stuff shows up in the right places
        switch(quadrant) {
            case 0: // top-left
                dx = xLoc - edgeOffset
                dy = yLoc - edgeOffset
                padding = -22
                break;
            case 1: // top-right
                dx = xLoc + edgeOffset
                dy = yLoc - edgeOffset
                padding = -22
                break;
            case 2: // bottom-left
                dx = xLoc - edgeOffset
                dy = yLoc + edgeOffset
                padding = -18
                break;
            case 3: // bottom-right
                dx = xLoc + edgeOffset
                dy = yLoc + edgeOffset
                padding = -18
                break;
            default:
                break;
        }

        // set a class to determine the style of the annotation line
        countClass = (this.getNumberNumber(d.data.count) === 0) ? ' zero-circle' : '';

        // create the annotation rules to pass back to the annotation generator
        return {
            x: d.x, y: d.y,
            dx: dx, dy: dy,
            className: "anno-" + quadrant + countClass,
            connector: { type: "line" },
            subject: {
                radius: (d.r - 2),
                radiusPadding: 1.5,
            },
            note: {
                lineType: "horizontal",
                align: "dynamic",
                title: d.data.type,
                label: d.data.count || "0",
                padding: padding,
                wrap: 200,
           },
           // we don't actually need the circle drawn, so we can disable it
           disable: ["subject"]
          }
    }

    drawCirclePack() {
        var annotations = [];

        this.g = select('svg')
            .attr('viewBox', [-32, -32, this.props.width + 64, this.props.height + 64])
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        var layout = pack()
            .size([this.props.width, this.props.height])
            .padding(5);

        var root = this.buildCircleData();
        var nodes = root.descendants();

        layout(root);

        var slices = this.g.selectAll('circle').data(nodes).enter().append('g')
            .on('click', (d) => {
                if (this.getNumberNumber(d.data.count) !== 0) {
                    return this.handleClick(d);
                }
            })
            .attr('class', (d) => {
                var cname = (d.parent) ? 'child-circle' : 'parent-circle';
                if (this.getNumberNumber(d.data.count) === 0) {
                    cname = cname + ' zero-circle';
                }
                return cname;
            });

        /**
         * Create the circles and attach click handler to them along with a class for the cursor
         */
        slices
            .append('circle')
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('r', (d) => d.r - 2)

        slices
            .filter((d) => d.parent && (d.r <= this.props.minSize))
            .each((d) => {
                annotations.push(this.buildAnnotations(d))
            })

        this.g
            .append('g')
            .attr('class', 'annotation-layer')
            .call(annotation()
                .annotations(annotations)
                .type(annotationCalloutCircle)
            )

        var sliceText = slices
            .filter((d) => d.parent && (d.r > this.props.minSize))
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y)


        sliceText
            .append('tspan')
            .text((d) => {
                if ((d.r - 2) >= this.props.minSize) {
                    if (d.parent) { return d.data.type }
                }
            })

        sliceText
            .append('tspan')
            .attr('x', (d) => d.x)
            .attr('dy', '1.25em')
            .attr('class', 'text-bold')
            .text((d) => {
                if ((d.r - 2) >= this.props.minSize) {
                    if (d.parent) { return d.data.count }
                }
            })

        sliceText
            .style("font-size", function (d) {
                /**
                 * this is getting declared as function(d) {}
                 * instead of (d) => {} for scope reasons
                 */
                var maxSize = 28;
                var minSize = 18;
                var finalSize;
                var calculatedSize = Math.floor((2 * d.r - 8) / this.getComputedTextLength() * 16);

                if (calculatedSize >= maxSize) {
                    finalSize = maxSize;
                } else if (calculatedSize <= minSize) {
                    finalSize = minSize;
                } else {
                    finalSize = calculatedSize;
                }
                return finalSize + "px";
            })
    }

    updateCirclePack() {
        this.g
            .selectAll('g')
            .data(this.buildCircleData().descendants())
            .attr('class', (d) => {
                var cname = (d.parent) ? 'child-circle' : 'parent-circle';
                if (this.getNumberNumber(d.data.count) === 0) {
                    cname += ' zero-circle';
                }
                if (d.data.param === this.props.active && d.parent) {
                    cname += ' active-circle'
                }
                return cname;
            })
    }

    render() {
        /**
         * set the height and width of the container based on the
         * height/width props passed in
         */
        var containerStyle = {
            height: this.props.height,
            width: this.props.width,
        }

        return (
            <div className={this.props.className + " circles"} style={containerStyle}>
                <svg></svg>
            </div>
        )
    }
}
