import p5, { SoundLoop } from 'p5';
import 'p5/lib/addons/p5.sound';

export const videoSynthesizer = (p) => {
    let props = [];
    let power = false;
    let VOa = Object;
    let mic = Object;
    let fft = Object;
    let bands = [];
    let prevBands = [];
    let modulation = [];

    //props => array
    //props.find(prop=> prop.key === belowItems)
    //basicShape
    //screenSplitShape
    //screenSplitNum
    p.pushProps = (_props) => {
        props = _props.selector;
        power = _props.power;
    };

    p.gp = (prm) => {
        switch (prm) {
            case 'BS':
                return props.find((prop) => prop.key === 'basicShape').val;
            case 'BSS':
                return props.find((prop) => prop.key === 'basicShapeSize').val - modulation[0];
            case 'SSS':
                return props.find((prop) => prop.key === 'screenSplitShape').val;
            case 'SSN':
                return props.find((prop) => prop.key === 'screenSplitNum').val - modulation[1];
            case 'SSP':
                return props.find((prop) => prop.key === 'screenSplitSpread').val;
            case 'SH':
                return props.find((prop) => prop.key === 'shapeHue').val - modulation[0] * 50;
        }
    };

    class VideoOsc {
        constructor(width, height) {
            this.pg = p.createGraphics(width, height);
            this.pg.colorMode(p.HSB, 360, 100, 100, 1.0);
        }

        renderShape = (x, y, BS, BSS, hue) => {
            const pg = this.pg;

            pg.fill(p.gp('SH'), 100, 100);
            switch (BS) {
                case 1: //circle
                    pg.ellipseMode(p.CENTER);
                    pg.ellipse(x, y, BSS * 10, BSS * 10);
                    break;
                case 2: //rectangle
                    pg.rectMode(p.CENTER);
                    pg.rect(x, y, BSS * 10, BSS * 10);
                    break;
                case 3: //triangle
                    pg.triangle(x - BSS * 5, y + BSS * 5, x, y - BSS * 5, x + BSS * 5, y + BSS * 5);
                    break;
                case 4: //X
                    pg.line(x + BSS * 5, y + BSS * 5, x - BSS * 5, y - BSS * 5);
                    pg.line(x - BSS * 5, y + BSS * 5, x + BSS * 5, y - BSS * 5);
                    break;
            }
        };

        renderSplit = (SSS, SSN) => {
            const pg = this.pg;
            const R = p.gp('SSP');
            const BS = p.gp('BS');
            const BSS = p.gp('BSS');
            switch (SSS) {
                case 1: {
                    //circle
                    pg.push();
                    pg.translate(pg.width / 2, pg.height / 2);
                    if (SSN > 1) {
                        for (let i = 0; i < SSN; i++) {
                            let xpos = p.cos(p.radians(i * (360 / SSN))) * (p.width / R);
                            let ypos = p.sin(p.radians(i * (360 / SSN))) * (p.width / R);
                            this.renderShape(xpos, ypos, BS, BSS, 65);
                        }
                    } else {
                        this.renderShape(0, 0, BS, BSS, 65);
                    }
                    pg.pop();
                    break;
                }

                case 2: {
                    //square

                    if (SSN > 1) {
                        pg.push();
                        pg.translate(pg.width / (SSN * 2), pg.width / (SSN * 2));
                        for (let i = 0; i < SSN * 2; i += 2) {
                            for (let j = 0; j < SSN * 2; j += 2) {
                                this.renderShape(
                                    i * (p.width / (SSN * 2)),
                                    j * (p.width / (SSN * 2)),
                                    BS,
                                    BSS,
                                    65,
                                );
                            }
                        }
                        pg.pop();
                    } else {
                        pg.push();
                        pg.translate(pg.width / 2, pg.height / 2);
                        this.renderShape(0, 0, BS, BSS, 65);
                        pg.pop();
                    }
                    break;
                }
            }
        };

        render() {
            const pg = this.pg;
            pg.background(255);
            this.renderSplit(p.gp('SSS'), p.gp('SSN'));
        }
    }

    p.analyze = (fft) => {
        let spectrum = fft.analyze();
        let current = [];
        for (let i = 0; i < 4; i++) {
            let band = spectrum.slice(i * 4, (i + 1) * 4);
            current.push(band);
        }

        let avers = [];
        for (let band of current) {
            let sum = band.reduce((a, b) => a + b);
            let average = sum / 4;
            avers.push(average);
        }

        return avers;
    };

    p.setup = () => {
        p.frameRate(60);
        p.createCanvas(500, 500);
        p.noCursor();
        VOa = new VideoOsc(p.width, p.height);

        mic = new p5.AudioIn();
        fft = new p5.FFT(0.7, 16);

        mic.stop();

        fft.setInput(mic);
    };

    p.draw = () => {
        if (power) {
            p.getAudioContext().resume();
            mic.start();

            modulation = [];
            prevBands = bands;
            bands = p.analyze(fft);

            for (let i = 0; i < 4; i++) {
                let diff = prevBands[i] - bands[i];
                modulation.push(diff / 3);
            }
        } else {
            mic.stop();
        }

        p.background(255);
        p.fill(0);
        VOa.render();
        p.imageMode(p.CENTER);
        p.image(VOa.pg, p.width / 2, p.height / 2);
    };
};
