/* Genius Kids Academy - Reading content: 20 levels, grade 3 path from letter sounds to short paragraphs.
   Each level: words (w = word, h = hint/key word, s = sentence), story (title, text, questions), speed (default seconds per word). */
window.GKA = window.GKA || {};
window.GKA.content = window.GKA.content || {};
window.GKA.content.reading = {
  id: "reading",
  name: "Reading",
  color: "violet",
  modes: ["read", "speak", "listen", "write", "story"],
  levels: [
    {
      n: 1, name: "Letter sounds", skill: "Hear and say the sound each letter makes", speed: 2, letters: true,
      words: [
        { w: "a", h: "apple", s: "A is for apple." }, { w: "b", h: "ball", s: "B is for ball." }, { w: "c", h: "cat", s: "C is for cat." },
        { w: "d", h: "dog", s: "D is for dog." }, { w: "e", h: "egg", s: "E is for egg." }, { w: "f", h: "fish", s: "F is for fish." },
        { w: "g", h: "goat", s: "G is for goat." }, { w: "m", h: "moon", s: "M is for moon." }, { w: "s", h: "sun", s: "S is for sun." },
        { w: "t", h: "top", s: "T is for top." }, { w: "p", h: "pig", s: "P is for pig." }, { w: "n", h: "nest", s: "N is for nest." }
      ],
      story: {
        title: "Max the Cat",
        text: "Sam has a cat. The cat is Max. Max sat on a mat. Max naps in the sun.",
        questions: [
          { q: "Who is the cat?", o: ["Max", "Sam", "Dan"], a: 0 },
          { q: "Where did Max sit?", o: ["On a mat", "On a bed", "In a box"], a: 0 },
          { q: "What does Max do in the sun?", o: ["Naps", "Runs", "Eats"], a: 0 }
        ]
      }
    },
    {
      n: 2, name: "Short a words", skill: "Read 3-letter words with the short a sound", speed: 2,
      words: [
        { w: "cat", s: "The cat is soft." }, { w: "hat", s: "I have a red hat." }, { w: "map", s: "Look at the map." }, { w: "bag", s: "My bag is big." },
        { w: "can", s: "I can run fast." }, { w: "pan", s: "The pan is hot." }, { w: "sad", s: "Do not be sad." }, { w: "van", s: "The van is blue." },
        { w: "jam", s: "I like jam on bread." }, { w: "rat", s: "The rat ran away." }, { w: "cap", s: "Put on your cap." }, { w: "nap", s: "The baby takes a nap." }
      ],
      story: {
        title: "The Red Hat",
        text: "Pat has a red hat. The hat is in a bag. A cat sat on the bag. Pat is sad. The cat ran. Pat has the hat!",
        questions: [
          { q: "What color is the hat?", o: ["Red", "Blue", "Green"], a: 0 },
          { q: "Where was the hat?", o: ["In a bag", "In a van", "On a mat"], a: 0 },
          { q: "Who sat on the bag?", o: ["A cat", "A rat", "Pat"], a: 0 }
        ]
      }
    },
    {
      n: 3, name: "Short i and o", skill: "Read words with short i and short o", speed: 2,
      words: [
        { w: "pig", s: "The pig is pink." }, { w: "sit", s: "Please sit down." }, { w: "lip", s: "I bit my lip." }, { w: "win", s: "We can win the game." },
        { w: "big", s: "The dog is big." }, { w: "dig", s: "Dogs like to dig." }, { w: "dog", s: "My dog can jump." }, { w: "hop", s: "Frogs hop." },
        { w: "pot", s: "The pot is full." }, { w: "box", s: "Open the box." }, { w: "log", s: "A frog sat on a log." }, { w: "mop", s: "Use the mop." }
      ],
      story: {
        title: "Big Dog, Little Pig",
        text: "A big dog ran to a log. A little pig sat on the log. The dog did not bark. The pig did not run. They sat in the sun. Now the dog and the pig are pals.",
        questions: [
          { q: "Where did the pig sit?", o: ["On a log", "In a box", "On a pot"], a: 0 },
          { q: "Did the dog bark?", o: ["No", "Yes", "Only once"], a: 0 },
          { q: "What are the dog and pig now?", o: ["Pals", "Sad", "Lost"], a: 0 }
        ]
      }
    },
    {
      n: 4, name: "Short e and u", skill: "Read words with short e and short u", speed: 1.5,
      words: [
        { w: "pen", s: "Write with a pen." }, { w: "bed", s: "Time for bed." }, { w: "hen", s: "The hen laid an egg." }, { w: "net", s: "The fish is in the net." },
        { w: "red", s: "The apple is red." }, { w: "ten", s: "I have ten toes." }, { w: "sun", s: "The sun is hot." }, { w: "cup", s: "Fill the cup." },
        { w: "bug", s: "A bug is on the leaf." }, { w: "nut", s: "The squirrel ate a nut." }, { w: "mud", s: "The pig loves mud." }, { w: "hug", s: "Give me a hug." }
      ],
      story: {
        title: "The Red Hen",
        text: "The red hen sat in the pen. She had ten eggs. The sun was hot. A bug ran up the cup. The hen said, cluck, cluck! The eggs went crack. Ten chicks ran out to the mud.",
        questions: [
          { q: "How many eggs did the hen have?", o: ["Ten", "Two", "Six"], a: 0 },
          { q: "What ran up the cup?", o: ["A bug", "A chick", "A hen"], a: 0 },
          { q: "Where did the chicks run?", o: ["To the mud", "To the bed", "To the net"], a: 0 }
        ]
      }
    },
    {
      n: 5, name: "Sight words 1", skill: "Know common words by sight", speed: 1.5,
      words: [
        { w: "the", s: "The dog is here." }, { w: "and", s: "Tom and Ann play." }, { w: "you", s: "I see you." }, { w: "see", s: "I see a bird." },
        { w: "said", s: "Mom said yes." }, { w: "was", s: "It was fun." }, { w: "like", s: "I like cake." }, { w: "go", s: "Let us go." },
        { w: "my", s: "This is my hat." }, { w: "come", s: "Come here, please." }, { w: "here", s: "Sit here." }, { w: "play", s: "We play outside." },
        { w: "have", s: "I have a pet." }, { w: "with", s: "Come with me." }
      ],
      story: {
        title: "Come and Play",
        text: "Ben said, come and play with me! Ann said, I like to play. Do you have a ball? Ben said, yes, here it is. They go to the park. The park was fun. Ann said, I see my dog! The dog ran to Ann and Ben.",
        questions: [
          { q: "Who asked Ann to play?", o: ["Ben", "Mom", "The dog"], a: 0 },
          { q: "What did Ben have?", o: ["A ball", "A kite", "A hat"], a: 0 },
          { q: "Where did they go?", o: ["To the park", "To school", "Home"], a: 0 }
        ]
      }
    },
    {
      n: 6, name: "Blends bl, cl, fl, gl, sl", skill: "Read words that start with l blends", speed: 1.5,
      words: [
        { w: "black", s: "The cat is black." }, { w: "clap", s: "Clap your hands." }, { w: "flag", s: "The flag waves." }, { w: "glad", s: "I am glad to see you." },
        { w: "slip", s: "Do not slip on the ice." }, { w: "blue", s: "The sky is blue." }, { w: "clock", s: "The clock says three." }, { w: "flip", s: "Flip the pancake." },
        { w: "glue", s: "Use glue for the paper." }, { w: "sled", s: "We ride the sled." }, { w: "block", s: "Stack the block." }, { w: "flat", s: "The tire is flat." }
      ],
      story: {
        title: "The Blue Sled",
        text: "Snow fell all night. Glen got his blue sled. He ran up the hill with his black dog. The dog did slip and slide. Glen was glad. They went down fast! At the top, Glen put a flag in the snow. Then the clock said noon, and they went home for hot soup.",
        questions: [
          { q: "What color is the sled?", o: ["Blue", "Black", "Red"], a: 0 },
          { q: "Who slipped on the hill?", o: ["The dog", "Glen", "Mom"], a: 0 },
          { q: "What did Glen put in the snow?", o: ["A flag", "A block", "A clock"], a: 0 }
        ]
      }
    },
    {
      n: 7, name: "Blends st, sp, tr, dr, gr", skill: "Read words with s and r blends", speed: 1.2,
      words: [
        { w: "stop", s: "Stop at the sign." }, { w: "spin", s: "Spin the top." }, { w: "trip", s: "We took a trip." }, { w: "drum", s: "Beat the drum." },
        { w: "grab", s: "Grab your coat." }, { w: "star", s: "I see a star." }, { w: "spot", s: "The dog has a spot." }, { w: "tree", s: "The tree is tall." },
        { w: "drop", s: "Do not drop the cup." }, { w: "grin", s: "She has a big grin." }, { w: "stick", s: "The dog found a stick." }, { w: "trap", s: "The box is a trap." }
      ],
      story: {
        title: "Drum in the Tree",
        text: "Grace heard a drum. Bump, bump, bump! She ran to the big tree. A bird sat on a stick and tapped it on the trunk. Tap, tap, tap. It was not a drum at all. Grace had a big grin. She did not stop the bird. She sat on a spot of grass and listened until the first star came out.",
        questions: [
          { q: "What did Grace think she heard?", o: ["A drum", "A car", "A dog"], a: 0 },
          { q: "What was really making the sound?", o: ["A bird with a stick", "A boy with a drum", "The wind"], a: 0 },
          { q: "When did Grace stop listening?", o: ["When the first star came out", "When it rained", "When Mom called"], a: 0 }
        ]
      }
    },
    {
      n: 8, name: "Digraphs sh, ch, th, wh", skill: "Two letters, one sound", speed: 1.2,
      words: [
        { w: "ship", s: "The ship sails." }, { w: "chip", s: "I ate a chip." }, { w: "thin", s: "The paper is thin." }, { w: "when", s: "When is lunch?" },
        { w: "fish", s: "The fish swims." }, { w: "much", s: "Thank you so much." }, { w: "bath", s: "Take a bath." }, { w: "shop", s: "We shop for food." },
        { w: "chat", s: "Let us chat." }, { w: "with", s: "Come with me." }, { w: "whip", s: "Whip the cream." }, { w: "dish", s: "Wash the dish." }
      ],
      story: {
        title: "Fish for Lunch",
        text: "Chad and his dad went to the shop. What should we get for lunch? asked Dad. Fish and chips! said Chad. They got a big fish and a thin bag of chips. At home, Dad put the fish in a dish. Chad set the table. When the fish was done, they ate every bit. Then it was time for a bath, because Chad had sauce on his chin.",
        questions: [
          { q: "Where did Chad and Dad go?", o: ["To the shop", "To the ship", "To the bath"], a: 0 },
          { q: "What did they get for lunch?", o: ["Fish and chips", "Soup", "Pizza"], a: 0 },
          { q: "Why did Chad need a bath?", o: ["He had sauce on his chin", "He fell in mud", "He went swimming"], a: 0 }
        ]
      }
    },
    {
      n: 9, name: "Magic e", skill: "The silent e makes the vowel say its name", speed: 1.2,
      words: [
        { w: "cake", s: "The cake is sweet." }, { w: "bike", s: "I ride my bike." }, { w: "home", s: "We go home." }, { w: "cube", s: "An ice cube is cold." },
        { w: "kite", s: "The kite flies high." }, { w: "nose", s: "Touch your nose." }, { w: "game", s: "Let us play a game." }, { w: "time", s: "What time is it?" },
        { w: "rope", s: "Pull the rope." }, { w: "tune", s: "Hum a tune." }, { w: "wave", s: "Wave to Grandma." }, { w: "five", s: "I have five apples." }
      ],
      story: {
        title: "The Kite Game",
        text: "Jade made a kite at home. It had a long rope and five bright tails. Time to fly it! she said. At the park, the wind made a tune in the trees. Jade ran, and the kite rose up and up. Her brother Luke rode his bike beside her. Wave to the kite! he laughed. When the sun went down, they ate cake on the grass and went home.",
        questions: [
          { q: "How many tails did the kite have?", o: ["Five", "Two", "Ten"], a: 0 },
          { q: "What did Luke ride?", o: ["A bike", "A horse", "A bus"], a: 0 },
          { q: "What did they eat on the grass?", o: ["Cake", "Chips", "Soup"], a: 0 }
        ]
      }
    },
    {
      n: 10, name: "Vowel teams ai, ee, oa, ea", skill: "Two vowels that work together", speed: 1,
      words: [
        { w: "rain", s: "The rain is soft." }, { w: "feet", s: "My feet are cold." }, { w: "boat", s: "The boat floats." }, { w: "leaf", s: "A leaf fell down." },
        { w: "tail", s: "The dog wags its tail." }, { w: "tree", s: "The tree is green." }, { w: "road", s: "Cross the road safely." }, { w: "seat", s: "Take a seat." },
        { w: "mail", s: "The mail came today." }, { w: "seed", s: "Plant the seed." }, { w: "soap", s: "Wash with soap." }, { w: "team", s: "Our team won." }
      ],
      story: {
        title: "The Seed by the Road",
        text: "Dean found a seed by the road. He put it in the dirt under a tree and gave it a drink. Then the rain came for three days. When the sun came back, a tiny green leaf peeked out. Every week Dean checked his plant. It grew taller than his feet, then taller than his knees. One day it had a yellow flower. Dean's whole team came to see it, and a bee landed right on top.",
        questions: [
          { q: "Where did Dean find the seed?", o: ["By the road", "In a boat", "In the mail"], a: 0 },
          { q: "How long did it rain?", o: ["Three days", "One day", "A week"], a: 0 },
          { q: "What landed on the flower?", o: ["A bee", "A leaf", "A bird"], a: 0 },
          { q: "What color was the flower?", o: ["Yellow", "Red", "Blue"], a: 0 }
        ]
      }
    },
    {
      n: 11, name: "Sight words 2", skill: "Bigger words you just have to know", speed: 1,
      words: [
        { w: "because", s: "I smiled because I was happy." }, { w: "around", s: "We walked around the lake." }, { w: "before", s: "Wash your hands before dinner." }, { w: "right", s: "Turn right at the corner." },
        { w: "again", s: "Read it again." }, { w: "always", s: "I always brush my teeth." }, { w: "think", s: "I think it will rain." }, { w: "would", s: "Would you like some?" },
        { w: "could", s: "I could hear the birds." }, { w: "every", s: "Every day is new." }, { w: "together", s: "We work together." }, { w: "people", s: "Many people came." },
        { w: "through", s: "Walk through the door." }, { w: "another", s: "May I have another?" }
      ],
      story: {
        title: "The Lost Mitten",
        text: "Every winter morning, Mia walks to school with her friend Omar. Today Mia could not find her right mitten. I think I left it at the park, she said. They walked around the pond and through the gate. There it was, on a bench, right where she sat before! People smiled as Mia waved it in the air. Let us always check the bench, said Omar. Together they ran the rest of the way, and they were not late, because they ran so fast.",
        questions: [
          { q: "What did Mia lose?", o: ["Her right mitten", "Her hat", "Her lunch"], a: 0 },
          { q: "Where was it?", o: ["On a bench at the park", "At home", "In her bag"], a: 0 },
          { q: "Why were they not late?", o: ["They ran fast", "School was closed", "They took a bus"], a: 0 }
        ]
      }
    },
    {
      n: 12, name: "Two-syllable words", skill: "Break long words into two beats", speed: 1,
      words: [
        { w: "rabbit", s: "The rabbit hops." }, { w: "kitten", s: "The kitten purrs." }, { w: "basket", s: "Fill the basket." }, { w: "pencil", s: "Sharpen the pencil." },
        { w: "muffin", s: "I baked a muffin." }, { w: "sunset", s: "The sunset was orange." }, { w: "picnic", s: "We had a picnic." }, { w: "window", s: "Open the window." },
        { w: "happy", s: "The kids are happy." }, { w: "dinner", s: "Dinner is ready." }, { w: "garden", s: "The garden is green." }, { w: "button", s: "Press the button." }
      ],
      story: {
        title: "Picnic in the Garden",
        text: "On Sunday, Nadia packed a basket for a picnic in the garden. She put in muffins, apples, and a pencil to draw with. Her kitten followed her out the window and chased a rabbit around the flowers. Nadia laughed and drew the rabbit in her notebook. When the sunset turned the sky orange, Mom called them in for dinner. Nadia pressed the button on the porch light, and the garden glowed. It was a happy day.",
        questions: [
          { q: "What did Nadia pack in the basket?", o: ["Muffins, apples, and a pencil", "Books and a ball", "A sandwich only"], a: 0 },
          { q: "What did the kitten chase?", o: ["A rabbit", "A bird", "A ball"], a: 0 },
          { q: "What color was the sunset?", o: ["Orange", "Purple", "Gray"], a: 0 }
        ]
      }
    },
    {
      n: 13, name: "Endings -ing, -ed, -s", skill: "Words that tell when things happen", speed: 0.9,
      words: [
        { w: "jumping", s: "The frog is jumping." }, { w: "played", s: "We played all day." }, { w: "running", s: "The dog is running." }, { w: "wanted", s: "I wanted a cookie." },
        { w: "singing", s: "The birds are singing." }, { w: "looked", s: "She looked outside." }, { w: "hoping", s: "I am hoping for snow." }, { w: "stopped", s: "The bus stopped." },
        { w: "reading", s: "He is reading a book." }, { w: "helped", s: "Dad helped me." }, { w: "swimming", s: "Fish are swimming." }, { w: "walked", s: "We walked home." }
      ],
      story: {
        title: "The Swimming Lesson",
        text: "Leo wanted to learn swimming more than anything. On Monday, he walked to the pool with his sister, Ava, who helped him put on his goggles. He stopped at the edge and looked at the deep water. Ava was already jumping in, splashing and singing. Leo took a breath and hoped for the best. He kicked his legs and moved his arms the way the teacher showed him. He was swimming! By Friday, he was running to the pool every morning, and he never wanted to stop.",
        questions: [
          { q: "What did Leo want to learn?", o: ["Swimming", "Reading", "Singing"], a: 0 },
          { q: "Who helped him with his goggles?", o: ["Ava", "The teacher", "Dad"], a: 0 },
          { q: "How did Leo feel by Friday?", o: ["He loved swimming", "He was scared", "He was bored"], a: 0 }
        ]
      }
    },
    {
      n: 14, name: "Prefixes un- and re-", skill: "Un means not. Re means again", speed: 0.9,
      words: [
        { w: "unhappy", s: "The lost puppy was unhappy." }, { w: "redo", s: "I will redo my drawing." }, { w: "unlock", s: "Unlock the door." }, { w: "replay", s: "Replay the song." },
        { w: "untie", s: "Untie your shoes." }, { w: "rewrite", s: "Rewrite the sentence neatly." }, { w: "unfair", s: "That rule is unfair." }, { w: "return", s: "Return the book." },
        { w: "unpack", s: "Unpack your bag." }, { w: "refill", s: "Refill the water bottle." }, { w: "unkind", s: "Do not be unkind." }, { w: "review", s: "Review your spelling words." }
      ],
      story: {
        title: "The Unlucky Key",
        text: "Zara could not unlock the shed. The key would not turn. She felt unhappy, because her bike was inside. Dad said, let us review what happened. Did you return the key to the hook last night? Zara thought hard. She ran to unpack her school bag, and there it was, the real key! The one in her hand was the old key from the toy box. She untied her shoes, put them on properly, and tried again. Click! The door opened. Now I will always refill the hook with the right key, she said.",
        questions: [
          { q: "Why could Zara not open the shed?", o: ["She had the wrong key", "The door was stuck", "It was locked from inside"], a: 0 },
          { q: "Where was the real key?", o: ["In her school bag", "On the hook", "In the shed"], a: 0 },
          { q: "What was inside the shed?", o: ["Her bike", "Her dog", "A toy box"], a: 0 }
        ]
      }
    },
    {
      n: 15, name: "Suffixes -ful, -ly, -less", skill: "Endings that change what a word means", speed: 0.8,
      words: [
        { w: "helpful", s: "A helpful friend shares." }, { w: "quickly", s: "Run quickly!" }, { w: "careless", s: "A careless cook spills." }, { w: "joyful", s: "The party was joyful." },
        { w: "slowly", s: "Turtles walk slowly." }, { w: "fearless", s: "The fearless knight rode on." }, { w: "playful", s: "The puppy is playful." }, { w: "safely", s: "Cross the street safely." },
        { w: "useless", s: "A broken pen is useless." }, { w: "hopeful", s: "We are hopeful for sun." }, { w: "kindly", s: "She spoke kindly." }, { w: "endless", s: "The road seemed endless." }
      ],
      story: {
        title: "The Fearless Turtle",
        text: "Tilly the turtle moved slowly, but she was fearless. One joyful spring morning, the playful rabbits raced across the field and laughed at her. You are too slow, they said. That shell is useless! Tilly only smiled kindly. Then the sky went dark and the rain came quickly. The rabbits had nowhere to hide. Tilly tucked her head inside her shell, warm and dry. When the storm passed, she crawled out and said, come, I know a helpful cave nearby. The rabbits followed her safely, and after that day, nobody ever called her shell useless again.",
        questions: [
          { q: "What did the rabbits say about Tilly's shell?", o: ["It was useless", "It was pretty", "It was heavy"], a: 0 },
          { q: "What happened when the rain came?", o: ["Tilly stayed dry inside her shell", "Tilly got lost", "The rabbits hid in a tree"], a: 0 },
          { q: "How did Tilly treat the rabbits?", o: ["Kindly", "Angrily", "She ignored them"], a: 0 },
          { q: "Where did Tilly lead them?", o: ["To a cave", "To a pond", "To a farm"], a: 0 }
        ]
      }
    },
    {
      n: 16, name: "Compound words", skill: "Two small words make one big word", speed: 0.8,
      words: [
        { w: "sunflower", s: "The sunflower is tall." }, { w: "rainbow", s: "A rainbow has seven colors." }, { w: "football", s: "We play football." }, { w: "cupcake", s: "I ate a cupcake." },
        { w: "bedroom", s: "My bedroom is clean." }, { w: "starfish", s: "A starfish has five arms." }, { w: "pancake", s: "Flip the pancake." }, { w: "toothbrush", s: "Use your toothbrush." },
        { w: "butterfly", s: "A butterfly landed on me." }, { w: "snowman", s: "We built a snowman." }, { w: "playground", s: "Meet at the playground." }, { w: "homework", s: "Finish your homework." }
      ],
      story: {
        title: "Rainbow Over the Playground",
        text: "After a morning of rain, Kai finished his homework and ran to the playground. The grass was wet, and a bright rainbow stretched over the football field. A butterfly rested on a tall sunflower by the fence. Kai's friend Priya arrived with a box of cupcakes her grandmother had baked. They sat on the swings and ate two each. Then they found a flat rock shaped like a starfish and decided it was treasure. When the rainbow faded, they walked home, promising to come back tomorrow with a pancake picnic.",
        questions: [
          { q: "Where was the rainbow?", o: ["Over the football field", "Over the school", "Over the sea"], a: 0 },
          { q: "What did Priya bring?", o: ["Cupcakes", "Pancakes", "A football"], a: 0 },
          { q: "What was the rock shaped like?", o: ["A starfish", "A heart", "A sunflower"], a: 0 },
          { q: "What did Kai do before going to the playground?", o: ["Finished his homework", "Built a snowman", "Brushed his teeth"], a: 0 }
        ]
      }
    },
    {
      n: 17, name: "Homophones", skill: "Words that sound the same but mean different things", speed: 0.8,
      words: [
        { w: "there", s: "Put the book over there." }, { w: "their", s: "That is their house." }, { w: "to", s: "We walk to school." }, { w: "two", s: "I have two hands." },
        { w: "too", s: "I want to come too." }, { w: "here", s: "Come here, please." }, { w: "hear", s: "I hear a song." }, { w: "see", s: "I see the moon." },
        { w: "sea", s: "Fish live in the sea." }, { w: "right", s: "Raise your right hand." }, { w: "write", s: "Write your name." }, { w: "know", s: "I know the answer." }
      ],
      story: {
        title: "Two Boats by the Sea",
        text: "Noor and her two cousins went to the sea to see the boats. Their uncle owned a small red boat, and he let them climb aboard. Can you hear the gulls? he asked. Noor could hear them crying over the waves. Look over there! said her cousin, pointing to a bigger boat. I want to go on that one too. Uncle laughed. First, learn to row the right way, he said. Then I will write your names on this boat, and it will be yours. Noor did not know how to row yet, but she picked up the oars and tried. By sunset, she knew.",
        questions: [
          { q: "How many cousins went with Noor?", o: ["Two", "Three", "One"], a: 0 },
          { q: "What could Noor hear?", o: ["Gulls", "Music", "A bell"], a: 0 },
          { q: "What did Uncle promise to do?", o: ["Write their names on the boat", "Buy a bigger boat", "Sail to an island"], a: 0 },
          { q: "What did Noor learn by sunset?", o: ["How to row", "How to swim", "How to fish"], a: 0 }
        ]
      }
    },
    {
      n: 18, name: "Grade 3 vocabulary 1", skill: "Big words that make stories better", speed: 0.7,
      words: [
        { w: "curious", s: "The curious cat opened the box." }, { w: "enormous", s: "The elephant is enormous." }, { w: "whisper", s: "Please whisper in the library." }, { w: "gentle", s: "Be gentle with the baby bird." },
        { w: "brave", s: "The brave girl climbed the rock." }, { w: "ancient", s: "The ancient tree is very old." }, { w: "invent", s: "Let us invent a new game." }, { w: "measure", s: "Measure the table with a ruler." },
        { w: "journey", s: "The journey took three days." }, { w: "shiver", s: "The cold wind made me shiver." }, { w: "delicious", s: "The soup is delicious." }, { w: "protect", s: "Helmets protect your head." }
      ],
      story: {
        title: "The Ancient Map",
        text: "In the attic, Ravi found an ancient map folded inside a book. He was curious, so he spread it on the floor and used a ruler to measure the path from his house to a big X near the river. It looked like an enormous journey, but Ravi felt brave. He packed a delicious sandwich and set off with his dog, Biscuit. The wind by the river made him shiver, and he had to be gentle as he climbed down the muddy bank. Under a rock, he found a tin box. Inside was a note in his grandmother's handwriting: Dear explorer, I made this map when I was eight. Now it is your turn to invent an adventure. Ravi grinned and whispered to Biscuit, let us protect this secret.",
        questions: [
          { q: "Where did Ravi find the map?", o: ["In the attic", "At school", "By the river"], a: 0 },
          { q: "What did he use to measure the path?", o: ["A ruler", "His feet", "A string"], a: 0 },
          { q: "Who made the map?", o: ["His grandmother", "A pirate", "His teacher"], a: 0 },
          { q: "What was in the tin box?", o: ["A note", "Gold coins", "A sandwich"], a: 0 }
        ]
      }
    },
    {
      n: 19, name: "Grade 3 vocabulary 2", skill: "Words for thinking and feeling", speed: 0.7,
      words: [
        { w: "imagine", s: "Imagine a castle in the clouds." }, { w: "famous", s: "The famous singer waved." }, { w: "nervous", s: "I felt nervous before the test." }, { w: "celebrate", s: "We celebrate birthdays with cake." },
        { w: "discover", s: "Scientists discover new animals." }, { w: "patient", s: "Be patient and wait your turn." }, { w: "exhausted", s: "After the race I was exhausted." }, { w: "mysterious", s: "A mysterious sound came from the cave." },
        { w: "fragile", s: "Glass is fragile, so carry it carefully." }, { w: "observe", s: "Observe the ants with a magnifying glass." }, { w: "predict", s: "I predict it will snow tonight." }, { w: "cooperate", s: "Teams must cooperate to win." }
      ],
      story: {
        title: "The Science Fair",
        text: "Maya was nervous. The science fair was tomorrow, and her volcano would not erupt. Imagine if nothing happens, she worried. Her brother Sam said, let us cooperate. First, we observe. They watched the baking soda and vinegar fizz in a cup, then tried more of each. I predict more soda will make a bigger blast, said Sam. He was right! The foam rolled down the fragile paper mountain and onto the table. Maya was exhausted but happy. At the fair, a famous scientist stopped at her table. He said he had discovered many mysterious things in his life, but a volcano built by a patient third grader was his favorite. That night, the family celebrated with ice cream.",
        questions: [
          { q: "Why was Maya nervous?", o: ["Her volcano would not erupt", "She lost her project", "She was late"], a: 0 },
          { q: "What did Sam predict?", o: ["More soda would make a bigger blast", "It would rain", "The judge would be late"], a: 0 },
          { q: "Who visited Maya's table?", o: ["A famous scientist", "Her teacher", "The mayor"], a: 0 },
          { q: "How did the family celebrate?", o: ["With ice cream", "With a movie", "With a trip"], a: 0 }
        ]
      }
    },
    {
      n: 20, name: "Short paragraphs", skill: "Read a whole paragraph and find the main idea", speed: 0.6,
      words: [
        { w: "paragraph", s: "A paragraph is a group of sentences about one idea." }, { w: "sentence", s: "A sentence starts with a capital letter." }, { w: "character", s: "The main character is a fox." }, { w: "problem", s: "Every story has a problem." },
        { w: "solution", s: "The solution fixed the problem." }, { w: "setting", s: "The setting is a snowy village." }, { w: "beginning", s: "The beginning introduces the hero." }, { w: "middle", s: "The middle is where things happen." },
        { w: "ending", s: "The ending made me smile." }, { w: "question", s: "Ask a question if you are unsure." }, { w: "answer", s: "Find the answer in the text." }, { w: "summary", s: "A summary tells the big idea in a few words." }
      ],
      story: {
        title: "The Lighthouse Keeper's Daughter",
        text: "Elena lived in a white lighthouse on a rocky island with her father, the keeper. Every evening she climbed one hundred and twelve steps to help him light the great lamp. The beam swept across the dark sea so that ships would not crash on the rocks.\n\nOne stormy night, her father slipped on the wet stairs and hurt his ankle. He could not climb. Elena, you must light the lamp, he said. Elena was afraid. The wind howled and the stairs were slippery, but she thought of the sailors out at sea. She wrapped her hands in a cloth, took the matches, and climbed, counting every step aloud so she would not lose courage.\n\nAt the top, she struck a match. The lamp flared to life, and the golden beam cut through the rain. Far away, a fishing boat turned safely toward the harbor. In the morning, the captain rowed to the island with a basket of fresh bread to say thank you. From that night on, everyone in the village called her the Keeper's Daughter, and she was proud of the name.",
        questions: [
          { q: "What is the setting of this story?", o: ["A lighthouse on a rocky island", "A city apartment", "A farm in the hills"], a: 0 },
          { q: "What was the problem?", o: ["Her father hurt his ankle and could not light the lamp", "The lamp was stolen", "A ship sank"], a: 0 },
          { q: "How did Elena keep her courage on the stairs?", o: ["She counted every step aloud", "She sang a song", "She closed her eyes"], a: 0 },
          { q: "What was the solution?", o: ["Elena lit the lamp herself", "The sailors lit the lamp", "The storm stopped"], a: 0 },
          { q: "Which sentence is the best summary?", o: ["A brave girl lights the lighthouse lamp and saves a boat.", "A girl bakes bread for a captain.", "A father climbs one hundred stairs."], a: 0 }
        ]
      }
    }
  ]
};

/* Register as Grade 3 */
(window.GKA.contentParts = window.GKA.contentParts || []).push({ subject: "reading", grade: "g3", levels: window.GKA.content.reading.levels });
