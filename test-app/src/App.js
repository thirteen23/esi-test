import React from 'react';
import TestComp from 'test-component';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recentlyClicked: ""
        }
        this.onClick = this.onClick.bind(this);
    }
    testData = [
        {
            "type":"Criteria not met",
            "count":"1,985",
            "percent":"44",
            "param":"Criteria-Not-Met"
        },
        {
            "type":"Adherent",
            "count":"500",
            "percent":"11",
            "param":"Adherent"
        },
        {
            "type":"Non-Adherent",
            "count":"2,000",
            "percent":"45",
            "param":"Non-Adherent"
        }
    ];

    onClick(from) {
        this.setState({recentlyClicked: from})
    }

    render() {
        return (
            <div className = "App" >
                <header className = "App-header" >
                    <TestComp data={this.testData} onClick={this.onClick} />
                    Recently clicked: {this.state.recentlyClicked}
                </header>
            </div>
        );
    }
}

export default App;
