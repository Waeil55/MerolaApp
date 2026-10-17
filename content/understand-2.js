/* Understand, levels 21-35.
   Stage 3 (21-30): mini stories of two or three sentences, two or three questions each.
   Stage 4 (31-35): paragraphs of four to six sentences, four questions each.
   Item: { title, p: picture, text, qs: [ { k, q, o: [right answer first, ...], e: "words from the sentence that holds the answer" } ] }
   True or false: { k: "tf", q: statement, a: true/false, e }. Order: { k: "order", q, items: [in the right order] }. */
(window.GKA = window.GKA || {}).contentParts = window.GKA.contentParts || [];
window.GKA.contentParts.push({ subject: "understand", grade: "all", levels: [
  { n: 21, stage: 3, name: "Two sentences", skill: "The answer can be in either sentence", tip: "both", items: [
    { p: "👧🐶", text: "Kim has a little dog. The dog's name is Pip.", qs: [
      { k: "who", q: "Who has a little dog?", o: ["Kim", "Pip", "Mom"], e: "Kim has a little dog" },
      { k: "what", q: "What is the dog's name?", o: ["Pip", "Kim", "Max"], e: "name is Pip" }] },
    { p: "👨🥞", text: "Dad made pancakes. Lily ate three of them.", qs: [
      { k: "who", q: "Who made pancakes?", o: ["Dad", "Lily", "Mom"], e: "Dad made pancakes" },
      { k: "how", q: "How many pancakes did Lily eat?", o: ["Three", "Two", "Four"], e: "ate three" }] },
    { p: "🐸", text: "A frog sat on a log. It caught a fly with its long tongue.", qs: [
      { k: "what", q: "What did the frog catch?", o: ["A fly", "A fish", "A bee"], e: "caught a fly" },
      { k: "where", q: "Where did the frog sit?", o: ["On a log", "On a rock", "In the grass"], e: "sat on a log" }] },
    { p: "⚽🚗", text: "Tom lost his red ball. His sister found it under the car.", qs: [
      { k: "who", q: "Who found the ball?", o: ["His sister", "Tom", "His dad"], e: "His sister found it" },
      { k: "where", q: "Where was the ball?", o: ["Under the car", "In the tree", "On the roof"], e: "under the car" }] }] },
  { n: 22, stage: 3, name: "Where and when", skill: "Find places and times in two sentences", items: [
    { p: "👧🏫", text: "In the morning, Ana walks to school. She meets her friend at the gate.", qs: [
      { k: "when", q: "When does Ana walk to school?", o: ["In the morning", "At night", "After lunch"], e: "In the morning" },
      { k: "where", q: "Where does Ana meet her friend?", o: ["At the gate", "In the classroom", "At the park"], e: "at the gate" }] },
    { p: "🐻", text: "The bears sleep in a cave all winter. In spring, they wake up hungry.", qs: [
      { k: "where", q: "Where do the bears sleep?", o: ["In a cave", "In a tree", "In a nest"], e: "in a cave" },
      { k: "when", q: "When do the bears wake up?", o: ["In spring", "In winter", "At night"], e: "In spring" }] },
    { p: "👴🏡", text: "We visited Grandpa on Saturday. He lives in a small house by the lake.", qs: [
      { k: "when", q: "When did we visit Grandpa?", o: ["On Saturday", "On Monday", "On Friday"], e: "on Saturday" },
      { k: "where", q: "Where does Grandpa live?", o: ["In a small house by the lake", "In a big city", "On a farm"], e: "small house by the lake" }] },
    { p: "🌕", text: "After dinner, Ben went outside. He saw the full moon over the hill.", qs: [
      { k: "when", q: "When did Ben go outside?", o: ["After dinner", "Before dinner", "In the morning"], e: "After dinner" },
      { k: "where", q: "Where was the moon?", o: ["Over the hill", "Behind the house", "In the lake"], e: "over the hill" }] }] },
  { n: 23, stage: 3, name: "Three sentences", skill: "Read three sentences, then answer who, what and where", items: [
    { p: "👧👩🍎", text: "Mia and her mom went to the market. They bought apples and bread. Mia carried the bag home.", qs: [
      { k: "who", q: "Who carried the bag home?", o: ["Mia", "Her mom", "Her dad"], e: "Mia carried the bag" },
      { k: "what", q: "What did they buy?", o: ["Apples and bread", "Milk and eggs", "Cheese and grapes"], e: "bought apples and bread" },
      { k: "where", q: "Where did they go?", o: ["To the market", "To the park", "To school"], e: "went to the market" }] },
    { p: "🐦🌳", text: "A little bird fell out of its nest. Sam saw it on the grass. He gently put it back in the tree.", qs: [
      { k: "who", q: "Who saw the bird?", o: ["Sam", "A cat", "His mom"], e: "Sam saw it" },
      { k: "where", q: "Where did Sam put the bird?", o: ["Back in the tree", "In a box", "In his house"], e: "back in the tree" }] },
    { p: "🐠", text: "Leo has a fish named Bubbles. Bubbles lives in a round glass bowl. Leo feeds him every morning.", qs: [
      { k: "what", q: "What is the fish's name?", o: ["Bubbles", "Leo", "Goldie"], e: "named Bubbles" },
      { k: "where", q: "Where does Bubbles live?", o: ["In a round glass bowl", "In a pond", "In the sea"], e: "round glass bowl" },
      { k: "when", q: "When does Leo feed him?", o: ["Every morning", "Every night", "Every week"], e: "every morning" }] },
    { p: "🌳🏫", text: "The children planted a tree at school. Their teacher gave them a shovel. Now the tree is taller than the children.", qs: [
      { k: "what", q: "What did the children plant?", o: ["A tree", "Flowers", "Carrots"], e: "planted a tree" },
      { k: "who", q: "Who gave them a shovel?", o: ["Their teacher", "Their parents", "The farmer"], e: "teacher gave them a shovel" }] }] },
  { n: 24, stage: 3, name: "What happened first", skill: "Put events in order using first, next, then and last", tip: "order", items: [
    { p: "🧦👟", text: "First, Ben put on his socks. Then he put on his shoes. Last, he tied the laces.", qs: [
      { k: "order", q: "Put what Ben did in order.", items: ["Put on his socks", "Put on his shoes", "Tied the laces"] },
      { k: "order", q: "What did Ben do last?", o: ["Tied the laces", "Put on his socks", "Put on his shoes"], e: "Last, he tied the laces" }] },
    { p: "🥣", text: "Mom poured milk into a bowl. Next, she added the cereal. Then the family ate breakfast together.", qs: [
      { k: "order", q: "What did Mom do first?", o: ["Poured milk into a bowl", "Added the cereal", "Ate breakfast"], e: "Mom poured milk into a bowl" },
      { k: "order", q: "Put the events in order.", items: ["Mom poured the milk", "She added the cereal", "The family ate breakfast"] }] },
    { p: "🌱🌻", text: "The seed got water and sun. Soon a little green sprout came up. After many weeks, it grew into a big sunflower.", qs: [
      { k: "order", q: "Put the events in order.", items: ["The seed got water and sun", "A sprout came up", "It grew into a sunflower"] },
      { k: "what", q: "What came up after the seed got water and sun?", o: ["A little green sprout", "A big sunflower", "A tree"], e: "a little green sprout came up" }] },
    { p: "👧🚌", text: "Ana woke up late. She ran to the bus stop. The bus had already left, so Dad drove her to school.", qs: [
      { k: "order", q: "What happened right after Ana woke up late?", o: ["She ran to the bus stop", "Dad drove her to school", "She ate breakfast"], e: "She ran to the bus stop" },
      { k: "how", q: "How did Ana get to school?", o: ["Dad drove her", "She took the bus", "She walked"], e: "Dad drove her to school" }] }] },
  { n: 25, stage: 3, name: "Feelings", skill: "Find clues that show how someone feels", tip: "feel", items: [
    { p: "👦🐶", text: "Sam got a new puppy for his birthday. He jumped up and down and hugged it.", qs: [
      { k: "feel", q: "How did Sam feel?", o: ["Happy", "Sad", "Angry"], e: "jumped up and down" },
      { k: "feel", q: "Which words show how Sam felt?", o: ["He jumped up and down and hugged it", "Sam got a new puppy", "For his birthday"], e: "jumped up and down" }] },
    { p: "🍦", text: "Lily dropped her ice cream on the ground. Tears rolled down her cheeks.", qs: [
      { k: "feel", q: "How did Lily feel?", o: ["Sad", "Excited", "Proud"], e: "Tears rolled down" },
      { k: "why", q: "Why did Lily feel that way?", o: ["She dropped her ice cream", "She was tired", "She lost her dog"], e: "dropped her ice cream" }] },
    { p: "⛈️🧸", text: "The thunder was very loud. Ben hid under his blanket and held his teddy bear tight.", qs: [
      { k: "feel", q: "How did Ben feel?", o: ["Scared", "Happy", "Bored"], e: "hid under his blanket" },
      { k: "why", q: "What made Ben feel that way?", o: ["The loud thunder", "His teddy bear", "His blanket"], e: "thunder was very loud" }] },
    { p: "🎹", text: "Mia practiced the piano every day. At the show, she played with no mistakes and smiled at the crowd.", qs: [
      { k: "feel", q: "How did Mia feel at the show?", o: ["Proud", "Angry", "Sleepy"], e: "smiled at the crowd" },
      { k: "why", q: "Why did Mia play so well?", o: ["She practiced every day", "She was lucky", "Her mom played for her"], e: "practiced the piano every day" }] }] },
  { n: 26, stage: 3, name: "Finding the reason", skill: "The reason can be in a different sentence", items: [
    { p: "🧊🚗", text: "The road was covered in ice. Dad drove very slowly.", qs: [
      { k: "why", q: "Why did Dad drive slowly?", o: ["The road was covered in ice", "He was tired", "The car was old"], e: "covered in ice" },
      { k: "tf", q: "Dad drove fast.", a: false, e: "drove very slowly" }] },
    { p: "🥪", text: "Ana forgot her lunch at home. Her friend Kim shared her sandwich with her.", qs: [
      { k: "why", q: "Why did Kim share her sandwich?", o: ["Ana forgot her lunch", "Kim was not hungry", "It was Ana's birthday"], e: "forgot her lunch" },
      { k: "who", q: "Who shared a sandwich?", o: ["Kim", "Ana", "The teacher"], e: "Kim shared her sandwich" }] },
    { p: "🪴", text: "The plant on the window was dry and brown. Nobody had watered it for two weeks.", qs: [
      { k: "why", q: "Why was the plant dry and brown?", o: ["Nobody had watered it", "The cat ate it", "It was too cold"], e: "Nobody had watered it" },
      { k: "how", q: "How long had nobody watered it?", o: ["Two weeks", "Two days", "One month"], e: "two weeks" }] },
    { p: "📝", text: "Max studied his spelling words every night. On Friday, he got all ten words right.", qs: [
      { k: "why", q: "Why did Max get all the words right?", o: ["He studied every night", "The words were easy", "He guessed"], e: "studied his spelling words" },
      { k: "how", q: "How many words did Max get right?", o: ["All ten", "Five", "Nine"], e: "all ten words" }] }] },
  { n: 27, stage: 3, name: "He, she, it, they", skill: "Find who a pronoun points back to", tip: "ref", items: [
    { p: "👧🐱", text: "Mia has a cat. She feeds it every morning.", qs: [
      { k: "ref", q: "In the second sentence, who is \"she\"?", o: ["Mia", "The cat", "Mom"], e: "Mia has a cat" },
      { k: "ref", q: "What does \"it\" mean?", o: ["The cat", "The morning", "Mia"], e: "Mia has a cat" }] },
    { p: "🎣🐟", text: "Ben and Sam went fishing. They caught two fish.", qs: [
      { k: "ref", q: "Who are \"they\"?", o: ["Ben and Sam", "The two fish", "Ben and his dad"], e: "Ben and Sam went fishing" },
      { k: "how", q: "How many fish did they catch?", o: ["Two", "Three", "One"], e: "caught two fish" }] },
    { p: "🐶🦴", text: "The dog found a bone. He buried it in the yard.", qs: [
      { k: "ref", q: "Who is \"he\"?", o: ["The dog", "The bone", "The yard"], e: "The dog found a bone" },
      { k: "where", q: "Where did he bury the bone?", o: ["In the yard", "Under the bed", "At the park"], e: "in the yard" }] },
    { p: "👵📕", text: "Grandma gave Lily a book. Lily read it to her little brother.", qs: [
      { k: "ref", q: "What did Lily read? What is \"it\"?", o: ["The book from Grandma", "A letter", "A magazine"], e: "gave Lily a book" },
      { k: "who", q: "Who did Lily read to?", o: ["Her little brother", "Grandma", "Her friend"], e: "her little brother" }] }] },
  { n: 28, stage: 3, name: "Word clues", skill: "Use the words around a new word to find its meaning", tip: "word", items: [
    { p: "🐶✋", text: "The puppy was so tiny that it fit in Sam's hand.", qs: [
      { k: "word", q: "What does \"tiny\" mean?", o: ["Very small", "Very big", "Very fast"], e: "fit in Sam's hand" },
      { k: "where", q: "Where did the puppy fit?", o: ["In Sam's hand", "In a box", "In a shoe"], e: "fit in Sam's hand" }] },
    { p: "🥾😴", text: "After the long hike, Ana was exhausted. She fell asleep right away.", qs: [
      { k: "word", q: "What does \"exhausted\" mean?", o: ["Very tired", "Very hungry", "Very happy"], e: "fell asleep right away" },
      { k: "why", q: "Why was Ana so tired?", o: ["She went on a long hike", "She was bored", "She was sick"], e: "After the long hike" }] },
    { p: "🍲", text: "The soup was scalding, so Dad blew on it before he ate.", qs: [
      { k: "word", q: "What does \"scalding\" mean?", o: ["Very hot", "Very cold", "Very salty"], e: "blew on it" },
      { k: "why", q: "Why did Dad blow on the soup?", o: ["It was very hot", "It was cold", "It smelled bad"], e: "blew on it" }] },
    { p: "🤖😠", text: "Leo was furious when his brother broke his robot. He stomped his feet and shouted.", qs: [
      { k: "word", q: "What does \"furious\" mean?", o: ["Very angry", "Very sleepy", "Very quiet"], e: "stomped his feet and shouted" },
      { k: "why", q: "Why was Leo furious?", o: ["His brother broke his robot", "He lost a game", "He was hungry"], e: "broke his robot" }] }] },
  { n: 29, stage: 3, name: "Main idea", skill: "Tell what a short text is mostly about", tip: "main", items: [
    { p: "🐝🌼", text: "Bees fly from flower to flower. They drink sweet nectar. They take it back to the hive to make honey.", qs: [
      { k: "main", q: "What is this mostly about?", o: ["How bees make honey", "Why flowers are pretty", "Where bees sleep"] },
      { k: "where", q: "Where do bees take the nectar?", o: ["Back to the hive", "To the river", "To a tree"], e: "back to the hive" }] },
    { p: "🦁🦒🐒", text: "Our class went to the zoo. We saw lions, giraffes and monkeys. The monkeys were the funniest.", qs: [
      { k: "main", q: "What is this mostly about?", o: ["Our class trip to the zoo", "Why monkeys are funny", "How lions eat"] },
      { k: "what", q: "Which animals were the funniest?", o: ["The monkeys", "The lions", "The giraffes"], e: "monkeys were the funniest" }] },
    { p: "🍕", text: "Dad wanted to make a pizza. He made the dough, added tomato sauce and cheese, then baked it. The whole family loved it.", qs: [
      { k: "main", q: "What is this mostly about?", o: ["Dad making a pizza", "The family eating at a restaurant", "How to grow tomatoes"] },
      { k: "what", q: "What did Dad add to the dough?", o: ["Tomato sauce and cheese", "Apples and honey", "Eggs and milk"], e: "added tomato sauce and cheese" }] },
    { p: "🐧", text: "Penguins cannot fly. But they are great swimmers. They use their wings like flippers in the water.", qs: [
      { k: "main", q: "What is this mostly about?", o: ["How penguins swim", "Why birds fly", "What penguins eat"] },
      { k: "tf", q: "Penguins can fly.", a: false, e: "Penguins cannot fly" }] }] },
  { n: 30, stage: 3, name: "Mini story review", skill: "Every kind of question in short stories", items: [
    { p: "👧🐱🧣", text: "Nina found a lost kitten in the rain. She wrapped it in her scarf and took it home. Her mom gave it warm milk.", qs: [
      { k: "what", q: "What did Nina wrap the kitten in?", o: ["Her scarf", "A towel", "Her coat"], e: "wrapped it in her scarf" },
      { k: "what", q: "What did her mom give the kitten?", o: ["Warm milk", "Cold water", "A fish"], e: "gave it warm milk" },
      { k: "feel", q: "How does Nina feel about the kitten?", o: ["She cares about it", "She is scared of it", "She does not like it"], e: "wrapped it in her scarf" }] },
    { p: "🏫🎵", text: "It was the last day of school. The children cleaned their desks and sang a song. Then they said goodbye to their teacher for the summer.", qs: [
      { k: "order", q: "Put the events in order.", items: ["They cleaned their desks", "They sang a song", "They said goodbye"] },
      { k: "when", q: "When did this happen?", o: ["On the last day of school", "On the first day of school", "On a Monday in winter"], e: "last day of school" }] },
    { p: "👦🪙🚗", text: "Omar wanted to buy a toy car. He saved his coins for three weeks. At last, he had enough money.", qs: [
      { k: "why", q: "Why did Omar save his coins?", o: ["To buy a toy car", "To give to his sister", "To buy candy"], e: "wanted to buy a toy car" },
      { k: "how", q: "How long did Omar save?", o: ["Three weeks", "Three days", "Three months"], e: "three weeks" },
      { k: "next", q: "What will Omar probably do next?", o: ["Buy the toy car", "Lose his coins", "Go to sleep"] }] },
    { p: "🌩️", text: "The sky turned dark gray. The wind began to blow hard. Mom told everyone to come inside.", qs: [
      { k: "next", q: "What is probably about to happen?", o: ["A storm is coming", "It will be very sunny", "It is time for lunch"] },
      { k: "why", q: "Why did Mom tell everyone to come inside?", o: ["The weather was getting bad", "It was dinner time", "They were too loud"], e: "wind began to blow hard" }] }] },

  { n: 31, stage: 4, name: "Look back in a paragraph", skill: "Go back to the paragraph to find details", tip: "lookback", items: [
    { title: "The Lost Mitten", p: "⛄🧤", text: "It was a cold winter day. Sofia was building a snowman in the yard with her little brother, Leo. When they finished, Sofia saw that one of her red mittens was gone. They looked everywhere. At last, Leo pointed at the snowman and laughed. The snowman was wearing the mitten on its stick arm!", qs: [
      { k: "when", q: "When does the story happen?", o: ["On a cold winter day", "On a hot summer day", "On a rainy spring day"], e: "cold winter day" },
      { k: "who", q: "Who was Sofia with?", o: ["Her little brother, Leo", "Her friend Mia", "Her dad"], e: "with her little brother" },
      { k: "what", q: "What color was the missing mitten?", o: ["Red", "Blue", "Green"], e: "red mittens" },
      { k: "where", q: "Where was the mitten?", o: ["On the snowman's arm", "In the yard", "In Leo's pocket"], e: "wearing the mitten" }] },
    { title: "The Big Bake Sale", p: "🍪🧁", text: "Our school had a bake sale on Friday to raise money for new library books. Every class baked something. My class made two hundred chocolate chip cookies. The kindergarten class made cupcakes with pink frosting. By the end of the day, we had sold everything. We raised enough money to buy fifty new books.", qs: [
      { k: "why", q: "Why did the school have a bake sale?", o: ["To raise money for library books", "To buy a new playground", "To pay for a class trip"], e: "raise money for new library books" },
      { k: "how", q: "How many cookies did my class make?", o: ["Two hundred", "Fifty", "One hundred"], e: "two hundred" },
      { k: "who", q: "Who made cupcakes?", o: ["The kindergarten class", "My class", "The teachers"], e: "kindergarten class made cupcakes" },
      { k: "tf", q: "They had food left over at the end of the day.", a: false, e: "sold everything" }] }] },
  { n: 32, stage: 4, name: "Time order", skill: "Follow the steps in order", tip: "order", items: [
    { title: "Making Lemonade", p: "🍋", text: "Mia and her dad made lemonade on a hot afternoon. First, they squeezed six lemons into a big jug. Next, they added cold water and some sugar. Then Mia stirred it with a long spoon. Finally, they dropped in ice cubes and poured two tall glasses.", qs: [
      { k: "order", q: "Put the steps in order.", items: ["Squeezed the lemons", "Added water and sugar", "Stirred it", "Added ice cubes"] },
      { k: "order", q: "What did they do right after squeezing the lemons?", o: ["Added cold water and sugar", "Added ice cubes", "Poured the glasses"], e: "Next, they added cold water" },
      { k: "how", q: "How many lemons did they use?", o: ["Six", "Two", "Ten"], e: "six lemons" },
      { k: "what", q: "What did Mia use to stir?", o: ["A long spoon", "A fork", "Her hand"], e: "long spoon" }] },
    { title: "The Butterfly", p: "🐛🦋", text: "A butterfly begins life as a tiny egg on a leaf. The egg hatches into a hungry caterpillar. The caterpillar eats leaves and grows bigger and bigger. Then it makes a hard case called a chrysalis. Inside, it changes. After about two weeks, a butterfly comes out and flies away.", qs: [
      { k: "order", q: "Put the life cycle in order.", items: ["Egg", "Caterpillar", "Chrysalis", "Butterfly"] },
      { k: "what", q: "What hatches from the egg?", o: ["A caterpillar", "A butterfly", "A bird"], e: "hatches into a hungry caterpillar" },
      { k: "what", q: "What does the caterpillar eat?", o: ["Leaves", "Flowers", "Bugs"], e: "eats leaves" },
      { k: "how", q: "How long does it stay in the chrysalis?", o: ["About two weeks", "About two days", "About a year"], e: "two weeks" }] }] },
  { n: 33, stage: 4, name: "Cause and effect", skill: "Find what made something happen", tip: "why", items: [
    { title: "The Muddy Shoes", p: "⚽👟", text: "Jack played soccer in the rain after school. The field was full of puddles. When he came home, his shoes were covered in mud. He left them by the door so the floor would stay clean. Mom smiled and said, \"Thank you for thinking ahead.\"", qs: [
      { k: "why", q: "Why were Jack's shoes muddy?", o: ["He played soccer on a wet field", "He walked in a garden", "His dog jumped on them"], e: "full of puddles" },
      { k: "why", q: "Why did Jack leave his shoes by the door?", o: ["So the floor would stay clean", "Because they were too small", "So he could find them"], e: "so the floor would stay clean" },
      { k: "why", q: "Why did Mom thank Jack?", o: ["He kept the floor clean", "He won the game", "He cleaned his room"], e: "He left them by the door" },
      { k: "when", q: "When did Jack play soccer?", o: ["After school", "Before school", "At lunch"], e: "after school" }] },
    { title: "Why Leaves Change", p: "🍂", text: "In the fall, the days get shorter and colder. Trees get less sunlight, so they stop making green food in their leaves. When the green goes away, we can see yellow and orange colors that were hiding there. Some leaves turn red. Soon the leaves dry up and fall to the ground.", qs: [
      { k: "why", q: "Why do trees stop making green food in the fall?", o: ["They get less sunlight", "They get too much rain", "Animals eat the leaves"], e: "less sunlight" },
      { k: "what", q: "What can we see when the green goes away?", o: ["Yellow and orange colors", "Blue and purple colors", "New green leaves"], e: "yellow and orange" },
      { k: "main", q: "What is this paragraph mostly about?", o: ["Why leaves change color in the fall", "How to rake leaves", "Why trees grow tall"] },
      { k: "tf", q: "The yellow colors were hiding in the leaves all along.", a: true, e: "hiding there" }] }] },
  { n: 34, stage: 4, name: "Characters", skill: "Understand how characters feel and what they are like", tip: "feel", items: [
    { title: "The New Girl", p: "👧🖍️", text: "Ava was the new girl in class. On her first day, she sat alone at lunch and looked down at her food. Then a boy named Kai sat next to her. He asked if she liked drawing, and she nodded. By the end of lunch, they were laughing and drawing silly animals together.", qs: [
      { k: "feel", q: "How did Ava feel at the start of lunch?", o: ["Lonely", "Excited", "Angry"], e: "sat alone at lunch" },
      { k: "feel", q: "How did Ava feel at the end of lunch?", o: ["Happy", "Scared", "Bored"], e: "they were laughing" },
      { k: "feel", q: "What kind of person is Kai?", o: ["Kind and friendly", "Mean", "Shy and quiet"], e: "sat next to her" },
      { k: "what", q: "What did they draw?", o: ["Silly animals", "Houses", "Cars"], e: "silly animals" }] },
    { title: "The Spelling Bee", p: "🐝🏆", text: "Diego practiced his spelling words with his grandma every night for a month. On the day of the spelling bee, his hands were shaking. When he heard his word, \"elephant,\" he took a deep breath. He spelled it slowly and correctly. The crowd cheered, and Diego grinned from ear to ear.", qs: [
      { k: "feel", q: "How did Diego feel before his turn?", o: ["Nervous", "Bored", "Sleepy"], e: "hands were shaking" },
      { k: "what", q: "What helped Diego calm down?", o: ["Taking a deep breath", "Drinking water", "Closing his eyes"], e: "deep breath" },
      { k: "feel", q: "How did Diego feel at the end?", o: ["Proud and happy", "Sad", "Worried"], e: "grinned from ear to ear" },
      { k: "who", q: "Who helped Diego practice?", o: ["His grandma", "His teacher", "His brother"], e: "with his grandma" }] }] },
  { n: 35, stage: 4, name: "Main idea and title", skill: "Find what a paragraph is mostly about and give it a title", tip: "main", items: [
    { title: "Owls", notitle: true, p: "🦉🌙", text: "Owls are birds that hunt at night. They have very large eyes that help them see in the dark. Owls can also turn their heads almost all the way around. Their soft feathers let them fly without making a sound. These special features make owls great night hunters.", qs: [
      { k: "main", q: "What is this paragraph mostly about?", o: ["Owls have special features for hunting at night", "Owls are pretty birds", "Owls live in barns"] },
      { k: "main", q: "Which is the best title?", o: ["Night Hunters", "My Pet Bird", "Birds That Swim"] },
      { k: "what", q: "What helps owls see in the dark?", o: ["Very large eyes", "Soft feathers", "Long legs"], e: "very large eyes" },
      { k: "why", q: "Why can owls fly without a sound?", o: ["Their feathers are soft", "They fly slowly", "They are small"], e: "soft feathers" }] },
    { title: "The Garden", notitle: true, p: "🍅🌱", text: "The garden was full of weeds. Grandpa and Rosa pulled them out one by one. They dug the soil and planted tomato and bean seeds. Every day they watered the rows. By summer, the garden was full of fresh vegetables to eat.", qs: [
      { k: "main", q: "What is this paragraph mostly about?", o: ["Grandpa and Rosa grew a vegetable garden", "Weeds are bad", "Rosa likes tomatoes"] },
      { k: "main", q: "Which is the best title?", o: ["The Garden Comes Alive", "A Trip to the Beach", "Rosa's New Dog"] },
      { k: "what", q: "What did they plant?", o: ["Tomato and bean seeds", "Corn and peas", "Flowers"], e: "tomato and bean seeds" },
      { k: "when", q: "When was the garden full of vegetables?", o: ["By summer", "In winter", "The next day"], e: "By summer" }] }] }
] });
