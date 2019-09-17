import React from 'react';
class TestComp extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.propRender = this.propRender.bind(this);
    }
    handleClick(e, d) {
        this.props.onClick(d)
    }

    propRender(data) {
        return data.data.map((datum, i) => {
            return(
                <div key={i}
                className='datum'
                onClick={(e) => this.handleClick(e, datum.type)}>
                    <div>Type: {datum.type}</div>
                    <div>Count: {datum.count}</div>
                    <div>Percent: {datum.percent}</div>
                    <div>Parameter: {datum.param}</div>
                </div>
            );
        });
    }

    render() {
        return (
            <div>
                <this.propRender data={this.props.data} />
            </div>
        );
    }
}
export default TestComp;
