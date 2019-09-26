import React from 'react';
import CirclePack from 'circlepack';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recentlyClicked: ""
        }
        this.onClick = this.onClick.bind(this);
    }

    demoData = {
        "data":[
            {
                "type":"Offered",
                "count":"20,000",
                "percent":"44",
                "param":"Offered"
            },
            {
                "type":"Accepted",
                "count":"10,300",
                "percent":"29",
                "param":"Accepted"
            },
            {
                "type":"Patient Sync'd",
                "count":"7,000",
                "percent":"16",
                "param":"Patient-Syncd"
            },
            {
                "type":"Patient Opted out",
                "count":"4,000",
                "percent":"9",
                "param":"Patient-Opted-out"
            },
            {
                "type":"Not Offered",
                "count":"1,000",
                "percent":"2",
                "param":"Not-Offered"
            },
            {
                "type": "Other",
                "count": "0",
                "percent": "0",
                "param":"other"
            },
            {
                "type": "Other",
                "count": "0",
                "percent": "0",
                "param":"other"
            },
            {
                "type": "Other",
                "count": "0",
                "percent": "0",
                "param":"other"
            }
        ],
        "totalPages":"1",
        "page":"1"
    };

    onClick(from) {
        this.setState({recentlyClicked: from})
    }

    render() {
        return (
            <div className = "App" >
                <header className = "App-header" >
                    <CirclePack
                        json={this.demoData} // Input data source for circle packing component
                        onClick={this.onClick} // click handler callback as prop
                        active={this.state.recentlyClicked} // prop for active category for highlighting
                        width={800} // width of container
                        height={600} // height of container
                        zeroAdjust={200} // amount to add when calculating circle size (Does not affect data display, just circle size)
                        minSize={75} // the minimum circle radius to display text in anything smaller than this will use annotation callout
                    />
                    Recently clicked: {this.state.recentlyClicked}
                </header>
            </div>
        );
    }
}

export default App;
