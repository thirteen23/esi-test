import React from 'react';
import { hierarchy, pack } from 'd3-hierarchy';
import { select } from 'd3-selection';


export default class CirclePack extends React.Component {
    constructor(props) {
        super(props);

        this.drawCirclePack = this.drawCirclePack.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.drawCirclePack();
    }

    componentDidUpdate(prevProps) {
        this.drawCirclePack();
    }

    handleClick(d) {
        this.props.onClick(d.data.type);
    }

    drawCirclePack() {
        var g = select('svg')
            .attr('viewBox', [0, 0, this.props.width, this.props.height])
            .attr('width', this.props.width)
            .attr('height', this.props.height)
            .select('g');

        var layout = pack()
            .size([this.props.width, this.props.height])
            .padding(3);

        var root = hierarchy(this.props.json)
            .sum((d) => {
                var count;
                /**
                 * We have to do some parsing here because the data provided
                 * as a sample is coming in as a preformatted string
                 * (e.g. "1,300") and not catching that was cousing
                 * some issues.
                 */
                if (typeof d.count === 'string') {
                    count = parseFloat(d.count.replace(/\,/g, ''));
                } else {
                    count = d.count;
                }
                return count;
            })
            .sort((d) => d.count);
        var nodes = root.descendants();
        layout(root);

        var slices = g.selectAll('circle').data(nodes).enter().append('g')
            .on('click', (d) => this.handleClick(d))
            .attr('class', (d) => (d.parent) ? 'child' : 'parent');

        /**
         * Create the circles and attach click handler to them along with a class for the cursor
         */
        slices
            .append('circle')
            .attr('cx', (d) =>  d.x)
            .attr('cy', (d) => d.y)
            .attr('r', (d) => d.r - 2);

        var sliceText = slices.append('text')
            .attr('text-anchor', 'middle');

        sliceText
            .append('tspan')
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y - 18)
            .text((d) => {
                if (d.parent) { return d.data.type }
            })
        sliceText
            .append('tspan')
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y + 18)
            .attr('class', 'text-bold')
            .text((d) => {
                if (d.parent) { return d.data.count }
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
