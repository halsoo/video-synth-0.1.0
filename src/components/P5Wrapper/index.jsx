import React, { Component } from 'react';
import { connect } from 'react-redux';
import p5 from 'p5';
import { videoSynthesizer } from './videoSynthesizer';

class P5Wrapper extends Component {
    constructor(props) {
        super(props);
        this.Canvas = React.createRef();
        this.state = {
            sketch: undefined,
        };
    }

    shouldComponentUpdate() {
        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.sketch === undefined) return null;
        else {
            let newSketch = { ...prevState }.sketch;
            newSketch.pushProps(nextProps.state);
            return { sketch: newSketch };
        }
    }

    componentDidMount() {
        this.setState({ sketch: new p5(videoSynthesizer, this.Canvas.current) });
    }

    componentWillUnmount() {
        this.Canvas.remove();
    }

    render() {
        return (
            <div className="w-full">
                <div className="mx-auto flex justify-center" ref={this.Canvas} />
            </div>
        );
    }
}

const MapState = (state) => {
    return {
        state: state,
    };
};

export default connect(MapState)(P5Wrapper);
