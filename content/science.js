/* Genius Kids Academy - Science content: 20 levels. Each level: lesson (read aloud), words (vocabulary with sentences),
   questions: { t: "mc", q, o, a } multiple choice, { t: "tf", q, a: true|false }, { t: "order", q, items (correct order) }. */
window.GKA = window.GKA || {};
window.GKA.content = window.GKA.content || {};
window.GKA.content.science = {
  id: "science", name: "Science", color: "orange",
  modes: ["learn", "read", "speak", "listen", "write", "quiz"],
  levels: [
    {
      n: 1, name: "Living or not?", skill: "Tell living things from non-living things", speed: 2,
      lesson: "Living things grow, need food and water, breathe, and make babies. A dog, a tree, and you are living things. A rock, a chair, and a toy car are non-living. They do not grow or eat. Some things that move, like a car, are still not alive, because they do not grow or need food.",
      words: [
        { w: "living", s: "A frog is a living thing." }, { w: "grow", s: "Plants grow toward the light." }, { w: "breathe", s: "We breathe air in and out." }, { w: "food", s: "All animals need food." },
        { w: "water", s: "Every living thing needs water." }, { w: "rock", s: "A rock does not grow." }, { w: "plant", s: "A plant is alive." }, { w: "animal", s: "A cat is an animal." }
      ],
      questions: [
        { t: "mc", q: "Which one is a living thing?", o: ["A tree", "A rock", "A spoon"], a: 0 },
        { t: "mc", q: "What do all living things need?", o: ["Food and water", "Wheels", "Paint"], a: 0 },
        { t: "tf", q: "A toy car is alive because it moves.", a: false },
        { t: "mc", q: "Which is non-living?", o: ["A chair", "A bird", "A flower"], a: 0 },
        { t: "tf", q: "Plants are living things.", a: true },
        { t: "mc", q: "Living things can...", o: ["Grow and have babies", "Only sit still", "Never change"], a: 0 }
      ]
    },
    {
      n: 2, name: "What plants need", skill: "Sunlight, water, air and soil", speed: 2,
      lesson: "Plants need four things to live: sunlight, water, air, and soil. Leaves catch sunlight and use it to make food. Roots drink water from the soil. If a plant gets no light, it turns yellow and droops. If it gets no water, it dries up. Too much water can also hurt a plant.",
      words: [
        { w: "sunlight", s: "Leaves catch sunlight." }, { w: "soil", s: "Roots grow in the soil." }, { w: "air", s: "Plants take in air." }, { w: "roots", s: "Roots drink water." },
        { w: "leaves", s: "Leaves make food for the plant." }, { w: "seed", s: "A seed can grow into a plant." }, { w: "sprout", s: "The seed will sprout in a week." }, { w: "wilt", s: "Flowers wilt without water." }
      ],
      questions: [
        { t: "mc", q: "Which part of a plant drinks water?", o: ["Roots", "Flower", "Leaves"], a: 0 },
        { t: "mc", q: "What do leaves use to make food?", o: ["Sunlight", "Rocks", "Wind"], a: 0 },
        { t: "tf", q: "A plant in a dark closet will stay green and healthy.", a: false },
        { t: "order", q: "Put the growing steps in order", items: ["Plant the seed in soil", "Water it and give it light", "A sprout pushes up", "Leaves open and the plant grows"] },
        { t: "mc", q: "How many things do plants need to live?", o: ["Four", "One", "Ten"], a: 0 },
        { t: "tf", q: "Too much water can hurt a plant.", a: true }
      ]
    },
    {
      n: 3, name: "Parts of a plant", skill: "Roots, stem, leaves, flower, fruit", speed: 2,
      lesson: "A plant has parts, and each part has a job. Roots hold the plant in the ground and take in water. The stem holds the plant up and carries water to the leaves. Leaves make food from sunlight. The flower makes seeds, and some flowers turn into fruit that holds the seeds inside.",
      words: [
        { w: "stem", s: "The stem holds the flower up." }, { w: "flower", s: "A bee visits the flower." }, { w: "fruit", s: "An apple is a fruit with seeds." }, { w: "petal", s: "Each petal is pink." },
        { w: "trunk", s: "A tree has a thick trunk." }, { w: "branch", s: "A bird sat on the branch." }, { w: "bud", s: "The bud will open soon." }, { w: "pollen", s: "Bees carry pollen." }
      ],
      questions: [
        { t: "mc", q: "Which part carries water up to the leaves?", o: ["Stem", "Petal", "Fruit"], a: 0 },
        { t: "mc", q: "Which part makes seeds?", o: ["Flower", "Root", "Stem"], a: 0 },
        { t: "tf", q: "Roots hold the plant in the ground.", a: true },
        { t: "mc", q: "An apple is a...", o: ["Fruit", "Root", "Leaf"], a: 0 },
        { t: "order", q: "From bottom to top, order the plant parts", items: ["Roots", "Stem", "Leaves", "Flower"] },
        { t: "tf", q: "Leaves make food for the plant.", a: true }
      ]
    },
    {
      n: 4, name: "Animal groups", skill: "Mammals, birds, fish, reptiles, amphibians, insects", speed: 1.5,
      lesson: "Scientists sort animals into groups. Mammals have fur or hair and feed milk to their babies, like dogs and whales. Birds have feathers and lay eggs. Fish live in water and breathe with gills. Reptiles, like snakes and turtles, have dry scales. Amphibians, like frogs, start life in water and later live on land. Insects have six legs and three body parts.",
      words: [
        { w: "mammal", s: "A whale is a mammal." }, { w: "bird", s: "A bird has feathers." }, { w: "fish", s: "A fish breathes with gills." }, { w: "reptile", s: "A snake is a reptile." },
        { w: "amphibian", s: "A frog is an amphibian." }, { w: "insect", s: "An ant is an insect." }, { w: "feathers", s: "Feathers keep birds warm." }, { w: "scales", s: "Lizards have dry scales." }
      ],
      questions: [
        { t: "mc", q: "Which animal is a mammal?", o: ["Whale", "Shark", "Frog"], a: 0 },
        { t: "mc", q: "How many legs does an insect have?", o: ["Six", "Four", "Eight"], a: 0 },
        { t: "tf", q: "All birds can fly.", a: false },
        { t: "mc", q: "Which group has dry scales?", o: ["Reptiles", "Mammals", "Amphibians"], a: 0 },
        { t: "mc", q: "A frog starts life in water. It is an...", o: ["Amphibian", "Insect", "Bird"], a: 0 },
        { t: "tf", q: "Fish breathe with gills.", a: true },
        { t: "mc", q: "Which animal feeds milk to its babies?", o: ["A cat", "A turtle", "A bee"], a: 0 }
      ]
    },
    {
      n: 5, name: "Habitats", skill: "Where animals and plants live", speed: 1.5,
      lesson: "A habitat is the place where a plant or animal lives and finds food, water, and shelter. A desert is hot and dry, so a camel stores fat in its hump. The ocean is salty water, home to fish and whales. A rainforest is warm and wet with tall trees. The Arctic is icy, and polar bears have thick fur to stay warm. Each living thing fits its habitat.",
      words: [
        { w: "habitat", s: "A pond is a frog's habitat." }, { w: "desert", s: "The desert is hot and dry." }, { w: "ocean", s: "The ocean is deep and salty." }, { w: "rainforest", s: "A rainforest is warm and wet." },
        { w: "arctic", s: "The Arctic is frozen." }, { w: "shelter", s: "A nest is a shelter." }, { w: "forest", s: "Deer live in the forest." }, { w: "grassland", s: "Zebras run on the grassland." }
      ],
      questions: [
        { t: "mc", q: "Which habitat is hot and dry?", o: ["Desert", "Ocean", "Arctic"], a: 0 },
        { t: "mc", q: "Why does a polar bear have thick fur?", o: ["To stay warm", "To swim faster", "To hide in sand"], a: 0 },
        { t: "tf", q: "A whale lives in the rainforest.", a: false },
        { t: "mc", q: "A habitat gives an animal...", o: ["Food, water, and shelter", "Toys", "Only sunlight"], a: 0 },
        { t: "mc", q: "Where would you find the tallest, wettest trees?", o: ["Rainforest", "Desert", "Arctic"], a: 0 },
        { t: "tf", q: "A camel stores fat in its hump.", a: true }
      ]
    },
    {
      n: 6, name: "The water cycle", skill: "Evaporation, condensation, precipitation", speed: 1.5,
      lesson: "Water moves in a circle called the water cycle. The sun heats water in lakes and seas. The water turns into vapor and rises. This is evaporation. High up, the vapor cools and turns into tiny drops that make clouds. This is condensation. When the drops get heavy, they fall as rain or snow. This is precipitation. The water flows back to rivers and seas, and the cycle starts again.",
      words: [
        { w: "evaporate", s: "Puddles evaporate in the sun." }, { w: "vapor", s: "Water vapor is a gas." }, { w: "condense", s: "Drops condense on a cold glass." }, { w: "precipitation", s: "Rain and snow are precipitation." },
        { w: "cloud", s: "A cloud is made of tiny drops." }, { w: "cycle", s: "A cycle goes round and round." }, { w: "river", s: "The river flows to the sea." }, { w: "steam", s: "Steam rose from the pot." }
      ],
      questions: [
        { t: "order", q: "Put the water cycle in order", items: ["The sun heats the water", "Water vapor rises", "Clouds form high up", "Rain falls down"] },
        { t: "mc", q: "What is it called when water turns into vapor?", o: ["Evaporation", "Condensation", "Precipitation"], a: 0 },
        { t: "mc", q: "Clouds are made of...", o: ["Tiny water drops", "Cotton", "Smoke"], a: 0 },
        { t: "tf", q: "Snow is a kind of precipitation.", a: true },
        { t: "mc", q: "What heats the water to start the cycle?", o: ["The sun", "The wind", "The moon"], a: 0 },
        { t: "tf", q: "The water cycle happens only once.", a: false }
      ]
    },
    {
      n: 7, name: "Weather and seasons", skill: "Weather changes, and the four seasons", speed: 1.2,
      lesson: "Weather is what the air is like outside right now: sunny, cloudy, rainy, windy, or snowy. A thermometer measures how hot or cold it is. Weather changes every day, but seasons change slowly. Spring is warm with new plants. Summer is hot with long days. Autumn, or fall, is cool and leaves change color. Winter is cold and days are short.",
      words: [
        { w: "weather", s: "Check the weather before you go out." }, { w: "thermometer", s: "The thermometer says 30 degrees." }, { w: "temperature", s: "The temperature is high today." }, { w: "season", s: "Winter is my favorite season." },
        { w: "spring", s: "Flowers bloom in spring." }, { w: "summer", s: "Summer days are long." }, { w: "autumn", s: "Leaves fall in autumn." }, { w: "winter", s: "It snows in winter." }
      ],
      questions: [
        { t: "mc", q: "What tool measures temperature?", o: ["Thermometer", "Ruler", "Clock"], a: 0 },
        { t: "order", q: "Order the seasons starting with spring", items: ["Spring", "Summer", "Autumn", "Winter"] },
        { t: "tf", q: "Weather can change every day.", a: true },
        { t: "mc", q: "In which season do leaves change color?", o: ["Autumn", "Summer", "Spring"], a: 0 },
        { t: "mc", q: "Which season has the longest days?", o: ["Summer", "Winter", "Autumn"], a: 0 },
        { t: "tf", q: "Seasons change every hour.", a: false }
      ]
    },
    {
      n: 8, name: "States of matter", skill: "Solid, liquid, gas", speed: 1.2,
      lesson: "Everything around you is made of matter. Matter comes in three states. A solid keeps its shape, like a rock or an ice cube. A liquid takes the shape of its container and can be poured, like water or juice. A gas spreads out to fill all the space, like the air in a balloon. Heat can change the state: ice melts into water, and boiling water turns into steam.",
      words: [
        { w: "matter", s: "Everything is made of matter." }, { w: "solid", s: "A brick is a solid." }, { w: "liquid", s: "Milk is a liquid." }, { w: "gas", s: "Air is a gas." },
        { w: "melt", s: "Ice cream will melt in the sun." }, { w: "freeze", s: "Water will freeze in the cold." }, { w: "boil", s: "Water will boil on the stove." }, { w: "shape", s: "A solid keeps its shape." }
      ],
      questions: [
        { t: "mc", q: "Which is a liquid?", o: ["Juice", "A spoon", "Air"], a: 0 },
        { t: "mc", q: "What happens when ice gets warm?", o: ["It melts", "It freezes", "It gets harder"], a: 0 },
        { t: "tf", q: "A gas fills all the space it is in.", a: true },
        { t: "mc", q: "Which state keeps its own shape?", o: ["Solid", "Liquid", "Gas"], a: 0 },
        { t: "order", q: "Order what happens as you heat ice", items: ["Ice (solid)", "Water (liquid)", "Steam (gas)"] },
        { t: "tf", q: "Water in a bottle keeps the bottle's shape.", a: true }
      ]
    },
    {
      n: 9, name: "Heat and temperature", skill: "How heat moves and changes things", speed: 1.2,
      lesson: "Heat is energy that makes things warmer. Heat moves from hot things to cold things. When you hold a cup of cocoa, heat moves from the cup to your hands. The sun, fire, and a stove all give off heat. Metal carries heat well, so a metal spoon in soup gets hot fast. Wood and cloth carry heat slowly, which is why a wooden spoon stays cool. Heat can melt, cook, and dry things.",
      words: [
        { w: "heat", s: "The fire gives off heat." }, { w: "energy", s: "Food gives you energy." }, { w: "warm", s: "The sun makes me warm." }, { w: "cool", s: "The shade is cool." },
        { w: "metal", s: "Metal gets hot fast." }, { w: "wood", s: "Wood stays cool longer." }, { w: "stove", s: "Do not touch the hot stove." }, { w: "degrees", s: "It is 25 degrees today." }
      ],
      questions: [
        { t: "mc", q: "Which way does heat move?", o: ["From hot to cold", "From cold to hot", "It does not move"], a: 0 },
        { t: "mc", q: "Which spoon gets hot fastest in soup?", o: ["Metal", "Wood", "Plastic"], a: 0 },
        { t: "tf", q: "The sun gives off heat.", a: true },
        { t: "mc", q: "Heat can...", o: ["Melt ice", "Make ice colder", "Turn water into rock"], a: 0 },
        { t: "tf", q: "A cold drink gives heat to your hand.", a: false },
        { t: "mc", q: "Heat is a kind of...", o: ["Energy", "Water", "Animal"], a: 0 }
      ]
    },
    {
      n: 10, name: "Push and pull", skill: "Forces make things move or stop", speed: 1,
      lesson: "A force is a push or a pull. When you kick a ball, you push it. When you open a drawer, you pull it. A bigger force makes things move faster or farther. Friction is a force that slows things down when they rub together. Rough ground has more friction than smooth ice. Gravity is a pull from the Earth that makes things fall down.",
      words: [
        { w: "force", s: "A push is a force." }, { w: "push", s: "Push the door open." }, { w: "pull", s: "Pull the wagon." }, { w: "friction", s: "Friction slows the sled." },
        { w: "gravity", s: "Gravity pulls the apple down." }, { w: "motion", s: "The ball is in motion." }, { w: "speed", s: "The car has high speed." }, { w: "smooth", s: "Ice is smooth." }
      ],
      questions: [
        { t: "mc", q: "What is a force?", o: ["A push or a pull", "A color", "A sound"], a: 0 },
        { t: "mc", q: "What makes a dropped ball fall to the ground?", o: ["Gravity", "Friction", "Wind"], a: 0 },
        { t: "tf", q: "A bigger push makes a ball go farther.", a: true },
        { t: "mc", q: "Which surface has more friction?", o: ["Rough carpet", "Smooth ice", "Wet glass"], a: 0 },
        { t: "tf", q: "Opening a drawer is a push.", a: false },
        { t: "mc", q: "Friction makes moving things...", o: ["Slow down", "Speed up", "Float"], a: 0 }
      ]
    },
    {
      n: 11, name: "Magnets", skill: "What magnets attract and repel", speed: 1,
      lesson: "A magnet pulls on some metals, like iron and steel. This pull is called attraction. Magnets do not pull on wood, plastic, or paper. Every magnet has two ends called poles, a north pole and a south pole. Opposite poles attract each other. Poles that are the same push away, or repel. The Earth is like a giant magnet, which is why a compass needle points north.",
      words: [
        { w: "magnet", s: "The magnet stuck to the fridge." }, { w: "attract", s: "Magnets attract iron." }, { w: "repel", s: "Like poles repel." }, { w: "pole", s: "Each magnet has a north pole." },
        { w: "iron", s: "Nails are made of iron." }, { w: "compass", s: "A compass points north." }, { w: "steel", s: "Paper clips are steel." }, { w: "north", s: "The needle points north." }
      ],
      questions: [
        { t: "mc", q: "Which object will a magnet pick up?", o: ["A steel paper clip", "A wooden block", "A plastic cup"], a: 0 },
        { t: "mc", q: "What happens when two north poles face each other?", o: ["They repel", "They attract", "Nothing"], a: 0 },
        { t: "tf", q: "Magnets attract paper.", a: false },
        { t: "mc", q: "How many poles does a magnet have?", o: ["Two", "One", "Five"], a: 0 },
        { t: "tf", q: "A compass needle points north because Earth is like a magnet.", a: true },
        { t: "mc", q: "Opposite poles...", o: ["Attract", "Repel", "Melt"], a: 0 }
      ]
    },
    {
      n: 12, name: "Light and shadows", skill: "Light travels, and blocks make shadows", speed: 1,
      lesson: "Light comes from the sun, lamps, and fire. Light travels in straight lines. We see things because light bounces off them into our eyes. When something blocks light, it makes a shadow on the other side. Shadows are long in the morning and evening when the sun is low, and short at noon when the sun is high. A mirror reflects light. Clear glass lets light pass through.",
      words: [
        { w: "light", s: "Turn on the light." }, { w: "shadow", s: "My shadow is long." }, { w: "reflect", s: "Mirrors reflect light." }, { w: "mirror", s: "Look in the mirror." },
        { w: "bright", s: "The sun is bright." }, { w: "dark", s: "The cave is dark." }, { w: "straight", s: "Light travels in a straight line." }, { w: "block", s: "The wall will block the light." }
      ],
      questions: [
        { t: "mc", q: "What makes a shadow?", o: ["Something blocking light", "Water", "Sound"], a: 0 },
        { t: "mc", q: "When are shadows shortest?", o: ["At noon", "In the morning", "In the evening"], a: 0 },
        { t: "tf", q: "Light travels in straight lines.", a: true },
        { t: "mc", q: "What does a mirror do to light?", o: ["Reflects it", "Eats it", "Turns it into sound"], a: 0 },
        { t: "tf", q: "We can see in a totally dark room.", a: false },
        { t: "mc", q: "Which gives off its own light?", o: ["The sun", "The moon", "A mirror"], a: 0 }
      ]
    },
    {
      n: 13, name: "Sound", skill: "Vibrations make sound", speed: 1,
      lesson: "Sound is made when something vibrates, which means it shakes back and forth very fast. A drum skin vibrates when you hit it. A guitar string vibrates when you pluck it. Sound travels through the air to your ears. Big, strong vibrations make loud sounds. Small vibrations make quiet sounds. Fast vibrations make high sounds, like a whistle. Slow vibrations make low sounds, like a big drum.",
      words: [
        { w: "sound", s: "I hear a sound." }, { w: "vibrate", s: "The string will vibrate." }, { w: "loud", s: "The drum is loud." }, { w: "quiet", s: "Whisper to be quiet." },
        { w: "pitch", s: "A whistle has a high pitch." }, { w: "echo", s: "I heard my echo in the cave." }, { w: "volume", s: "Turn down the volume." }, { w: "ear", s: "Sound goes into your ear." }
      ],
      questions: [
        { t: "mc", q: "What makes sound?", o: ["Vibrations", "Light", "Heat"], a: 0 },
        { t: "mc", q: "Fast vibrations make a...", o: ["High sound", "Low sound", "Quiet sound"], a: 0 },
        { t: "tf", q: "Big vibrations make loud sounds.", a: true },
        { t: "mc", q: "Sound travels to your ears through...", o: ["The air", "Light", "Wires only"], a: 0 },
        { t: "tf", q: "A big drum makes a higher sound than a whistle.", a: false },
        { t: "mc", q: "An echo is sound that...", o: ["Bounces back", "Stops", "Gets warmer"], a: 0 }
      ]
    },
    {
      n: 14, name: "Rocks and soil", skill: "What the ground is made of", speed: 0.9,
      lesson: "The ground under your feet is made of rocks and soil. Rocks can be big like boulders or tiny like sand. Over many years, wind and water break rocks into smaller pieces. This is called weathering. Soil is made of tiny rock pieces mixed with dead leaves and plants. Worms and bugs live in soil and help plants grow. Sandy soil drains water fast, and clay soil holds water.",
      words: [
        { w: "rock", s: "I found a smooth rock." }, { w: "soil", s: "Dig in the soil." }, { w: "sand", s: "Sand is tiny rock." }, { w: "clay", s: "Clay holds water." },
        { w: "boulder", s: "A boulder is a huge rock." }, { w: "weathering", s: "Weathering breaks rocks apart." }, { w: "mineral", s: "A rock is made of minerals." }, { w: "pebble", s: "A pebble fits in my hand." }
      ],
      questions: [
        { t: "mc", q: "What breaks big rocks into small pieces over time?", o: ["Wind and water", "Birds", "Paint"], a: 0 },
        { t: "mc", q: "Soil is made of tiny rock pieces and...", o: ["Dead plants and leaves", "Plastic", "Ice"], a: 0 },
        { t: "tf", q: "Sand is made of very tiny pieces of rock.", a: true },
        { t: "mc", q: "Which soil holds water best?", o: ["Clay", "Sand", "Gravel"], a: 0 },
        { t: "order", q: "Order from biggest to smallest", items: ["Boulder", "Rock", "Pebble", "Sand"] },
        { t: "tf", q: "Worms in soil are bad for plants.", a: false }
      ]
    },
    {
      n: 15, name: "Day, night, and the moon", skill: "Earth spins, the moon changes shape", speed: 0.9,
      lesson: "The Earth spins like a top. It takes 24 hours to spin all the way around. When your side of Earth faces the sun, it is day. When it turns away, it is night. The moon does not make its own light. It reflects sunlight. As the moon travels around Earth, we see different shapes called phases: new moon, crescent, half, and full moon. A full trip takes about one month.",
      words: [
        { w: "earth", s: "Earth is our planet." }, { w: "spin", s: "Earth spins once a day." }, { w: "moon", s: "The moon shines at night." }, { w: "phase", s: "A crescent is a moon phase." },
        { w: "crescent", s: "The crescent moon is thin." }, { w: "full", s: "The full moon is round." }, { w: "orbit", s: "The moon orbits Earth." }, { w: "hours", s: "A day has 24 hours." }
      ],
      questions: [
        { t: "mc", q: "Why do we have day and night?", o: ["Earth spins", "The sun turns off", "Clouds cover the sun"], a: 0 },
        { t: "mc", q: "How long does Earth take to spin once?", o: ["24 hours", "1 hour", "1 year"], a: 0 },
        { t: "tf", q: "The moon makes its own light.", a: false },
        { t: "mc", q: "Moon shapes are called...", o: ["Phases", "Clouds", "Seasons"], a: 0 },
        { t: "order", q: "Order the moon as it grows", items: ["New moon", "Crescent moon", "Half moon", "Full moon"] },
        { t: "tf", q: "It is night on the side of Earth facing away from the sun.", a: true }
      ]
    },
    {
      n: 16, name: "The solar system", skill: "The sun and eight planets", speed: 0.9,
      lesson: "The sun is a star at the center of our solar system. Eight planets travel around it in paths called orbits. From the sun outward they are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Mercury is closest and very hot. Earth is the third planet and the only one we know with life. Jupiter is the biggest. Saturn has beautiful rings. Earth takes one year to orbit the sun.",
      words: [
        { w: "sun", s: "The sun is a star." }, { w: "planet", s: "Earth is a planet." }, { w: "star", s: "A star makes its own light." }, { w: "solar", s: "Our solar system has eight planets." },
        { w: "Jupiter", s: "Jupiter is the biggest planet." }, { w: "Saturn", s: "Saturn has rings." }, { w: "Mars", s: "Mars is the red planet." }, { w: "telescope", s: "Look through the telescope." }
      ],
      questions: [
        { t: "mc", q: "What is at the center of the solar system?", o: ["The sun", "Earth", "The moon"], a: 0 },
        { t: "mc", q: "How many planets are there?", o: ["Eight", "Three", "Twenty"], a: 0 },
        { t: "tf", q: "Jupiter is the biggest planet.", a: true },
        { t: "order", q: "Order the first four planets from the sun", items: ["Mercury", "Venus", "Earth", "Mars"] },
        { t: "mc", q: "Which planet has big rings?", o: ["Saturn", "Mars", "Venus"], a: 0 },
        { t: "tf", q: "Earth takes one day to go around the sun.", a: false }
      ]
    },
    {
      n: 17, name: "Bones, muscles, and heart", skill: "How your body moves and pumps", speed: 0.8,
      lesson: "Your skeleton is made of 206 bones. Bones hold you up and protect soft parts: the skull protects your brain, and the ribs protect your heart and lungs. Muscles pull on bones to make you move. Your heart is a muscle that pumps blood around your body, about 100 times a minute when you rest. Lungs take in oxygen from the air. Exercise makes your heart and muscles strong.",
      words: [
        { w: "skeleton", s: "Your skeleton holds you up." }, { w: "bone", s: "The arm bone is long." }, { w: "muscle", s: "Muscles help you jump." }, { w: "heart", s: "Your heart pumps blood." },
        { w: "lungs", s: "Lungs take in air." }, { w: "skull", s: "The skull protects the brain." }, { w: "ribs", s: "Ribs protect your heart." }, { w: "oxygen", s: "We need oxygen to live." }
      ],
      questions: [
        { t: "mc", q: "What protects your brain?", o: ["Skull", "Ribs", "Knee"], a: 0 },
        { t: "mc", q: "What pumps blood around your body?", o: ["Heart", "Lungs", "Stomach"], a: 0 },
        { t: "tf", q: "Muscles pull on bones to make you move.", a: true },
        { t: "mc", q: "How many bones are in an adult skeleton?", o: ["206", "20", "2000"], a: 0 },
        { t: "tf", q: "Your lungs take in oxygen.", a: true },
        { t: "mc", q: "Exercise makes your heart...", o: ["Stronger", "Smaller", "Softer"], a: 0 }
      ]
    },
    {
      n: 18, name: "The five senses", skill: "Seeing, hearing, smelling, tasting, touching", speed: 0.8,
      lesson: "You learn about the world with five senses. Eyes see light and color. Ears hear sounds. Your nose smells, and your tongue tastes sweet, salty, sour, and bitter. Your skin feels hot, cold, soft, and rough. Each sense sends a message along nerves to your brain, and the brain figures out what it means. Senses keep you safe, like smelling smoke or hearing a car horn.",
      words: [
        { w: "senses", s: "We have five senses." }, { w: "sight", s: "Eyes give us sight." }, { w: "hearing", s: "Ears are for hearing." }, { w: "smell", s: "I smell cookies." },
        { w: "taste", s: "Lemons taste sour." }, { w: "touch", s: "I touch the soft cat." }, { w: "nerve", s: "A nerve carries messages." }, { w: "brain", s: "The brain thinks." }
      ],
      questions: [
        { t: "mc", q: "Which body part is for tasting?", o: ["Tongue", "Ear", "Nose"], a: 0 },
        { t: "mc", q: "Where do sense messages go?", o: ["To the brain", "To the feet", "To the stomach"], a: 0 },
        { t: "tf", q: "We have five senses.", a: true },
        { t: "mc", q: "Which sense tells you a blanket is soft?", o: ["Touch", "Sight", "Hearing"], a: 0 },
        { t: "tf", q: "Your nose can taste food.", a: false },
        { t: "mc", q: "Which sense warns you about smoke before you see it?", o: ["Smell", "Taste", "Touch"], a: 0 }
      ]
    },
    {
      n: 19, name: "Food chains", skill: "Who eats whom", speed: 0.8,
      lesson: "A food chain shows how energy moves from one living thing to another. It starts with the sun. Plants use sunlight to make food, so they are producers. Animals that eat plants are called herbivores, like rabbits and deer. Animals that eat other animals are carnivores, like foxes and hawks. Animals that eat both are omnivores, like bears and people. When living things die, decomposers like worms and mushrooms break them down into soil.",
      words: [
        { w: "producer", s: "Grass is a producer." }, { w: "herbivore", s: "A rabbit is a herbivore." }, { w: "carnivore", s: "A lion is a carnivore." }, { w: "omnivore", s: "A bear is an omnivore." },
        { w: "predator", s: "A hawk is a predator." }, { w: "prey", s: "The mouse is prey." }, { w: "decomposer", s: "A worm is a decomposer." }, { w: "energy", s: "Energy comes from the sun." }
      ],
      questions: [
        { t: "order", q: "Put this food chain in order", items: ["Sun", "Grass", "Rabbit", "Fox"] },
        { t: "mc", q: "An animal that eats only plants is a...", o: ["Herbivore", "Carnivore", "Decomposer"], a: 0 },
        { t: "mc", q: "Where does a food chain's energy start?", o: ["The sun", "A fox", "The soil"], a: 0 },
        { t: "tf", q: "Mushrooms and worms are decomposers.", a: true },
        { t: "mc", q: "A bear that eats berries and fish is an...", o: ["Omnivore", "Herbivore", "Producer"], a: 0 },
        { t: "tf", q: "Plants are called consumers because they make food.", a: false }
      ]
    },
    {
      n: 20, name: "Think like a scientist", skill: "Ask, predict, test, observe, explain", speed: 0.7,
      lesson: "Scientists follow steps to find answers. First, ask a question, like which paper towel soaks up more water. Next, make a prediction, which is a smart guess. Then do a fair test: change only one thing and keep everything else the same. Observe carefully and record what happens with numbers and drawings. Finally, explain the result and share it. If the prediction was wrong, that is fine. Scientists learn from every test.",
      words: [
        { w: "question", s: "Start with a question." }, { w: "predict", s: "I predict the ice will melt." }, { w: "experiment", s: "We did an experiment." }, { w: "observe", s: "Observe the plant each day." },
        { w: "record", s: "Record what you see." }, { w: "result", s: "The result surprised us." }, { w: "fair", s: "A fair test changes one thing." }, { w: "evidence", s: "Evidence proves the answer." }
      ],
      questions: [
        { t: "order", q: "Order the science steps", items: ["Ask a question", "Make a prediction", "Do a fair test", "Observe and record", "Explain the result"] },
        { t: "mc", q: "In a fair test, how many things do you change?", o: ["One", "All of them", "None"], a: 0 },
        { t: "mc", q: "A prediction is...", o: ["A smart guess about what will happen", "The final answer", "A kind of tool"], a: 0 },
        { t: "tf", q: "If your prediction is wrong, the experiment was a waste.", a: false },
        { t: "mc", q: "Writing down what you see is called...", o: ["Recording", "Predicting", "Guessing"], a: 0 },
        { t: "tf", q: "Scientists share their results with others.", a: true }
      ]
    }
  ]
};

/* Register as Grade 3 */
(window.GKA.contentParts = window.GKA.contentParts || []).push({ subject: "science", grade: "g3", levels: window.GKA.content.science.levels });
