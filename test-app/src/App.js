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

    packData = {
        "type": "data",
        "children": [
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
              "percent":"38",
              "param":"Non-Adherent"
           },
           {
              "type":"Adherent",
              "count":"250",
              "percent":"5",
              "param":"Adherent"
           },
           {
              "type":"Adherent",
              "count":"100",
              "percent":"2",
              "param":"Adherent"
           }
        ],
        "totalPages":"1",
        "page":"1"
     }

    onClick(from) {
        this.setState({recentlyClicked: from})
    }

    render() {
        return (
            <div className = "App" >
                <header className = "App-header" >
                    <CirclePack width={700} height={700} startDelay={500} elementDelay={50} json={this.packData} onClick={this.onClick} />
                    Recently clicked: {this.state.recentlyClicked}
                </header>
            </div>
        );
    }
}

export default App;
