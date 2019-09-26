import React from 'react';
import { hierarchy, pack } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { annotationCustomType, annotationCalloutCircle, annotation } from 'd3-svg-annotation';

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
            count = (n === '') ? 0 : parseFloat(n.replace(/\,/g, ''));
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
        var hpos = 0; // 0 left, 1 right
        var vpos = 0; // 0 top, 1 bottom
        if (d.x > d.parent.x) vpos += 1
        if (d.y > d.parent.y) hpos += 1

        return parseInt(hpos + '' + vpos, 2)
    }

    buildAnnotations(d) {
        var quadrant = this.getQuadrant(d)
        console.log(quadrant)

        return {
            "x": d.x,
            "y": d.y,
            "dx": -130,
            "dy": -30,
            "className": "anno-" + d.data.param,
            "connector": {
                "type": "line"
            },
            "subject": {
                "radius": (d.r - 2),
                "radiusPadding": 0
            },
            "note": {
                "lineType": "horizontal",
                "align": "dynamic",
                "title": d.data.type,
                "label": d.data.count || "0"
            }
          }
    }

    drawCirclePack() {

        var annotations = [];
        this.g = select('svg')
            .attr('viewBox', [0, 0, this.props.width, this.props.height])
            .attr('width', this.props.width)
            .attr('height', this.props.height)
            .select('g');

        var layout = pack()
            .size([this.props.width, this.props.height])
            .padding(3);

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
                var cname = (d.parent) ? 'child' : 'parent';
                if (this.getNumberNumber(d.data.count) === 0) {
                    cname = cname + ' zero';
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
            .append('g')
            .attr('class', 'annotation-circle')
            .each((d) => {
                if (d.parent && (d.r <= this.props.minSize)) {
                    annotations.push(this.buildAnnotations(d))
                }
            })
            .call(annotation()
                .annotations(annotations)
                .type(annotationCalloutCircle)
            )


        var sliceText = slices.append('text')
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
            .attr('dy', (d) => '1.25em')
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
                var cname = (d.parent) ? 'child' : 'parent';
                if (this.getNumberNumber(d.data.count) === 0) {
                    cname += ' zero';
                }
                if (d.data.param === this.props.active && d.parent) {
                    cname += ' active'
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
            <div className="circles" style={containerStyle}>
                <svg><g></g></svg>
            </div>
        )
    }
}
