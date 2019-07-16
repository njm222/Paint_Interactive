let socket, joystick, options, colour, pickr, pickrCount;
const letters = "89ABCDEF";
const pickrContainer = document.querySelector('.zone_pickr');

function setup() {
    pickr = [];
    pickrCount = 0;
    addPickr();

    socket = io('http://192.168.98.5:3000');
    colour = '#';
    for (let i = 0; i < 6; i++)
        colour += letters[(Math.floor(Math.random() * 8))];
    options = {
        zone: document.getElementById('zone_joystick'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
        /*restJoystick: false,*/
        color: colour
    };

    socket.on('connect', () => {
        joystick = nipplejs.create(options);
        startJoystickListener();
    });
}

function addPickr() {
    if(pickrCount < 5) {
        pickrContainer.appendChild(document.createElement('div'));
        pickrContainer.lastChild.className = 'pickr-'.concat(pickrCount.toString());

        pickr[pickrCount] = Pickr.create({
            el: '.zone_colour .pickr-'.concat(pickrCount.toString()),
            theme: 'nano',
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    cmyk: true,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });

        pickr[pickrCount++].on('init', instance => {
            let color = instance._color.toRGBA();       //Converts the hsva object to a rgba array.
            for(let i = 0; i < 3; i++) {
                color[i] = color[i] / 255;              //Normalize the rgba array
            }
            socket.emit('addedPickr', [
                pickrCount,
                color
            ]);
        }).on('save', (color, instance) => {
            color = color.toRGBA();                     //Converts the hsva object to a rgba array.
            for(let i = 0; i < 3; i++) {
                color[i] = color[i] / 255;              //Normalize the rgba array
            }
            socket.emit('changedColour', [
                instance.options.el.className.replace(/\D/g,''),
                color,
                pickrCount
            ]);
        });
        console.log("Picker Count: " + pickrCount);
    } else {
        alert("Sorry, there is a maximum of 5 colours")
    }
}

function removePickr() {
    if(pickrCount > 1) {
        pickr[--pickrCount].destroyAndRemove();
        socket.emit('removedPickr', pickrCount);
        console.log("Picker Count: " + pickrCount);
    } else {
        alert("Sorry, there must be at least one colour")
    }
}

function startJoystickListener() {
    joystick.on('start end move pressure', function (event, data) {
        socket.emit(event.type, data);
    });
}

setup();
