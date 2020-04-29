import React, { Component } from 'react';
import { connect } from 'react-redux';
import { increment, decrement } from '../../actions';
import ShapeSelector from './ShapeSelector';
import Slider from './Slider';

class ControlPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const splitShape = this.props.state.find((prop) => prop.key === 'screenSplitShape').val;
        return (
            <div className="mx-auto w-1/2 h-auto my-8 flex flex-wrap justify-around">
                <ShapeSelector name="basicShape" shapeNum={4} />
                <Slider name="basicShapeSize" />
                <ShapeSelector name="screenSplitShape" shapeNum={2} />
                <Slider name="screenSplitNum" />
                {splitShape == 1 ? <Slider name="screenSplitSpread" /> : null}
                <Slider name="shapeHue" />
            </div>
        );
    }
}

const MapState = (state) => ({
    state: state.selector,
});

const MapDispatch = { increment, decrement };

export default connect(MapState, MapDispatch)(ControlPanel);
