/* =====================================================================
   English Practice — 9th Grade (Syrian curriculum, Modules 1–6)
   5 tests × 50 questions = 250 total
   Sources:
     - Tests 1–4: sentences taken from textbook exercises (Modules 1–6)
     - Test 5  : built on the 2025 exam-paper pattern (Sections D & E)
   ===================================================================== */

const tests = {

  /* ===================================================================
     TEST 1 — Past & Present + Storytellers (Module 1)
     =================================================================== */
  test1: {
    title: "اختبار 1 — Past & Present / Storytellers",
    questions: [
      // ---- Feelings vocabulary (Unit 1) ----
      { q: "Yesterday, while I was shopping in the market, I fell into a box of fruit! I felt so ___.", topic: "Feelings",
        options: ["impressed", "excited", "embarrassed", "scared"], answer: 2 },
      { q: "I'm really ___ about the basketball match tomorrow!", topic: "Feelings",
        options: ["bored", "excited", "worried", "tired"], answer: 1 },
      { q: "You look really ___, Ali. Have you heard bad news?", topic: "Feelings",
        options: ["excited", "happy", "worried", "impressed"], answer: 2 },
      { q: "I'm so ___ with my brother. He took my new football to the park yesterday, and now he's lost it.", topic: "Feelings",
        options: ["angry", "impressed", "scared", "excited"], answer: 0 },
      { q: "I'm ___ about the test tomorrow. I studied hard, but I still don't think I know everything.", topic: "Feelings",
        options: ["excited", "nervous", "bored", "angry"], answer: 1 },
      { q: "Are you ___ of spiders? I am too.", topic: "Feelings",
        options: ["angry", "excited", "scared", "impressed"], answer: 2 },
      { q: "You sing beautifully, Nadia! I'm ___.", topic: "Feelings",
        options: ["bored", "impressed", "angry", "scared"], answer: 1 },

      // ---- Present simple / continuous dialogue ----
      { q: "A: What ___ you usually ___ when you get home from school?  (do)", topic: "Present Simple Q",
        options: ["are / doing", "do / do", "did / do", "have / done"], answer: 1 },
      { q: "B: I usually ___ something to eat.  (have)", topic: "Present Simple",
        options: ["am having", "have", "had", "have had"], answer: 1 },
      { q: "A: What university ___ your brother ___ at this year?  (study)", topic: "Present Continuous Q",
        options: ["does / study", "is / studying", "did / study", "has / studied"], answer: 1 },
      { q: "B: He ___ at Damascus University.  (study)", topic: "Present Continuous",
        options: ["studies", "studied", "is studying", "has studied"], answer: 2 },
      { q: "A: What ___ you ___ to on the radio? It sounds interesting.  (listen)", topic: "Present Continuous Q",
        options: ["do / listen", "are / listening", "did / listen", "have / listened"], answer: 1 },
      { q: "B: I ___ to a programme about space travel.  (listen)", topic: "Present Continuous",
        options: ["listen", "listened", "am listening", "have listened"], answer: 2 },
      { q: "A: What ___ your father ___ ?  (do — for a living)", topic: "Present Simple Q",
        options: ["does / do", "is / doing", "did / do", "has / done"], answer: 0 },
      { q: "B: He ___ a newspaper reporter.  (be)", topic: "Present Simple (be)",
        options: ["are", "is", "be", "was"], answer: 1 },

      // ---- Past simple / continuous (interrupted) ----
      { q: "Naser ___ his bike when he fell off.  (ride)", topic: "Past Continuous",
        options: ["rides", "rode", "was riding", "had ridden"], answer: 2 },
      { q: "I ___ for the bus, when it started to rain.  (wait)", topic: "Past Continuous",
        options: ["waited", "was waiting", "wait", "have waited"], answer: 1 },
      { q: "I was thinking about my English homework, when I ___ an idea for a story.  (have)", topic: "Past Simple",
        options: ["have", "had", "was having", "have had"], answer: 1 },
      { q: "I was lying in bed, when I ___ a noise downstairs.  (hear)", topic: "Past Simple",
        options: ["hear", "was hearing", "heard", "have heard"], answer: 2 },
      { q: "I ___ dinner, when the phone rang.  (have)", topic: "Past Continuous",
        options: ["have", "had", "was having", "am having"], answer: 2 },

      // ---- Postcard from London (Unit 1, ex.4) ----
      { q: "Dear Abdullah, I ___ my holiday in London.", topic: "Present Continuous",
        options: ["enjoy", "am enjoying", "enjoyed", "have enjoyed"], answer: 1 },
      { q: "We ___ all the famous places.", topic: "Present Continuous",
        options: ["visit", "visited", "are visiting", "were visiting"], answer: 2 },
      { q: "Yesterday we ___ to Covent Garden Market.", topic: "Past Simple",
        options: ["go", "went", "are going", "had gone"], answer: 1 },
      { q: "Here, you always ___ lots of interesting actors.", topic: "Present Simple",
        options: ["see", "are seeing", "saw", "have seen"], answer: 0 },
      { q: "One man ___ silver clothes.", topic: "Past Continuous",
        options: ["wears", "wore", "was wearing", "has worn"], answer: 2 },
      { q: "He ___ so still, I thought he was a statue.", topic: "Past Continuous",
        options: ["stood", "was standing", "stands", "has stood"], answer: 1 },
      { q: "I ___ away, when suddenly he put his hand on my shoulder.", topic: "Past Continuous",
        options: ["walked", "walk", "was walking", "had walked"], answer: 2 },
      { q: "Then I saw everyone laughing. I ___ so embarrassed!", topic: "Past Simple",
        options: ["feel", "was feeling", "felt", "have felt"], answer: 2 },

      // ---- could / couldn't / managed to / was able to (Unit 2) ----
      { q: "Because it was dark, they had candles on their tables, so that they ___ see.", topic: "could",
        options: ["can", "could", "couldn't", "manage"], answer: 1 },
      { q: "'Didn't you ___ to find what you had lost?' someone asked.", topic: "manage to",
        options: ["can", "could", "manage", "able"], answer: 2 },
      { q: "'I lost some money. I looked all over the garden, but I ___ find it.'", topic: "couldn't",
        options: ["can", "can't", "couldn't", "didn't manage"], answer: 2 },
      { q: "'But it ___ still be there! Why are you looking here?'", topic: "could",
        options: ["can", "could", "couldn't", "able to"], answer: 1 },
      { q: "'Because it was dark there. I ___ see anything.'", topic: "couldn't",
        options: ["couldn't", "wasn't able", "manage", "didn't"], answer: 0 },
      { q: "When I was young, I ___ do exactly the same things that I can do now.", topic: "could / was able to",
        options: ["can", "could", "manage", "able"], answer: 1 },
      { q: "I tried to lift the stone many times when I was young, but I didn't ___ to move it.", topic: "manage to",
        options: ["can", "able", "manage", "could"], answer: 2 },
      { q: "And when I grew old, I still ___ lift it.", topic: "couldn't",
        options: ["can't", "couldn't", "manage", "didn't able"], answer: 1 },
      { q: "Jack ___ reach the lock to open the door.", topic: "couldn't",
        options: ["couldn't", "didn't manage", "wasn't able", "all are correct"], answer: 3 },
      { q: "Luckily he ___ to find the key in his mother's handbag.", topic: "managed to",
        options: ["could", "managed", "was able", "able"], answer: 1 },
      { q: "She was finally ___ open the door.", topic: "able to",
        options: ["able to", "could", "managed", "could to"], answer: 0 },
      { q: "After my father broke his leg, he ___ drive for two months.", topic: "wasn't able to",
        options: ["couldn't to", "wasn't able to", "didn't manage", "doesn't able"], answer: 1 },

      // ---- used to / didn't use to / would ----
      { q: "When my grandfather was a boy, he ___ in a village high up in the mountains.", topic: "used to",
        options: ["used to live", "uses to live", "used to lived", "was used to live"], answer: 0 },
      { q: "They didn't ___ TV.", topic: "didn't use to",
        options: ["use to watch", "used to watch", "watched", "watch"], answer: 0 },
      { q: "At night they ___ games or read.", topic: "used to",
        options: ["use to play", "used to play", "used to played", "would played"], answer: 1 },
      { q: "They didn't ___ cars.", topic: "didn't use to",
        options: ["use to drive", "used to drive", "drove", "drive"], answer: 0 },
      { q: "They used to ___ horses into town to do the shopping.", topic: "used to + V1",
        options: ["rode", "rides", "ride", "riding"], answer: 2 },
      { q: "My grandfather used to ___ a long way to school every day.", topic: "used to + V1",
        options: ["walked", "walks", "walk", "walking"], answer: 2 },
      { q: "Which sentence is correct?", topic: "used to (form)",
        options: ["I use to live on a farm.", "I used to live on a farm.", "I used to lived on a farm.", "I am used to lived on a farm."], answer: 1 },
      { q: "Our fathers ___ together.", topic: "used to",
        options: ["use to work", "used to work", "used to worked", "used work"], answer: 1 },
      { q: "We ___ have a TV, so we listened to the radio or read.", topic: "didn't use to",
        options: ["didn't used to", "didn't use to", "don't use to", "wasn't used to"], answer: 1 },
      { q: "When I moved to Canada, I ___ miss the sunny weather.", topic: "used to",
        options: ["use to", "used to", "would", "am used to"], answer: 1 },
      { q: "It ___ very cold in the winter — it snowed nearly every day.", topic: "used to be",
        options: ["use to be", "used to be", "is used to be", "uses to be"], answer: 1 },
      { q: "We used to / would ___ there every weekend and swim, fish or sail. (Choose the correct verb)", topic: "used to / would",
        options: ["went", "going", "go", "gone"], answer: 2 }
    ]
  },

  /* ===================================================================
     TEST 2 — Modals + Cities + Articles (Modules 1–2, Units 3–5)
     =================================================================== */
  test2: {
    title: "اختبار 2 — Modals · Cities · Articles",
    questions: [
      // ---- should / must / mustn't / have to / don't have to ----
      { q: "When you write a story, you ___ remember to use the correct punctuation.", topic: "must",
        options: ["must", "mustn't", "don't have to", "ought not to"], answer: 0 },
      { q: "In English, you ___ start a sentence with a capital letter.", topic: "must",
        options: ["must", "mustn't", "don't have to", "had better not"], answer: 0 },
      { q: "You ___ forget to put a punctuation mark at the end of it.", topic: "mustn't",
        options: ["must", "mustn't", "have to", "had better"], answer: 1 },
      { q: "To make your writing more interesting, you ___ try to use lots of descriptive words and phrases.", topic: "should",
        options: ["mustn't", "should", "don't have to", "had better not"], answer: 1 },
      { q: "You ___ write the story from your own personal point of view, but it's better.", topic: "don't have to",
        options: ["must", "mustn't", "don't have to", "had better not"], answer: 2 },
      { q: "Before you start, you ___ write a plan of what you are going to say.", topic: "should / ought to",
        options: ["should", "mustn't", "don't have to", "had better not"], answer: 0 },
      { q: "And when you finish, you ___ always read your work through.", topic: "should",
        options: ["mustn't", "should", "don't have to", "had better not"], answer: 1 },
      { q: "You ___ start studying immediately!", topic: "had better",
        options: ["had better", "had better not", "don't have to", "mustn't"], answer: 0 },
      { q: "You ___ be able to spend at least one hour studying every day.", topic: "should",
        options: ["mustn't", "should", "don't have to", "had better not"], answer: 1 },
      { q: "You ___ work out a timetable, so that you have time to do all the things you need to do.", topic: "should",
        options: ["should", "mustn't", "don't have to", "had better not"], answer: 0 },
      { q: "You really ___ take your school work more seriously now.", topic: "ought to",
        options: ["ought to", "ought", "had better not", "don't have to"], answer: 0 },

      // ---- Rewrite using modals ----
      { q: "It's a good idea to make a revision timetable. → You ___ make a revision timetable.", topic: "should",
        options: ["shouldn't", "should", "mustn't", "don't have to"], answer: 1 },
      { q: "Don't be late, because the bus won't wait for you! → You ___ be late.", topic: "mustn't",
        options: ["should", "mustn't", "ought to", "don't have to"], answer: 1 },
      { q: "We are only allowed to wear black shoes to school. → We ___ wear black shoes.", topic: "have to",
        options: ["have to", "don't have to", "shouldn't", "had better not"], answer: 0 },
      { q: "It's important for me to remember my aunt's birthday. → I ___ remember my aunt's birthday.", topic: "must",
        options: ["must", "mustn't", "don't have to", "shouldn't"], answer: 0 },
      { q: "It isn't necessary to bring your own lunch. → You ___ bring your own lunch.", topic: "don't have to",
        options: ["mustn't", "don't have to", "shouldn't", "had better not"], answer: 1 },

      // ---- had better / ought to ----
      { q: "Amer really ___ be kinder to his younger brother.", topic: "ought to",
        options: ["ought to", "had better not", "don't have to", "ought"], answer: 0 },
      { q: "You ___ find your bus ticket. You won't be able to travel without it.", topic: "had better",
        options: ["had better", "had better not", "ought", "don't have to"], answer: 0 },
      { q: "Students ___ always do their homework.", topic: "ought to",
        options: ["ought", "ought to", "have", "had better not"], answer: 1 },
      { q: "You ___ try some of this food — it's delicious.", topic: "ought to",
        options: ["ought to", "ought", "had better not", "don't have to"], answer: 0 },
      { q: "Rashed ___ do more regular exercise. It would keep him fit and healthy.", topic: "had better",
        options: ["had better not", "ought", "had better", "don't have to"], answer: 2 },
      { q: "Your friend hasn't returned the library book. You say: You ___ return it.", topic: "had better",
        options: ["had better", "had better not", "don't have to", "mustn't"], answer: 0 },
      { q: "Your friend is always tired in the morning. You say: You ___ go to bed earlier.", topic: "ought to",
        options: ["ought", "ought to", "had better not", "don't have to"], answer: 1 },
      { q: "It's time for school and your brother is still in bed. You say: You ___ get up now!", topic: "had better",
        options: ["had better", "had better not", "ought", "don't have to"], answer: 0 },

      // ---- Cities — too / enough / too many / much / few ----
      { q: "I can't drive a car yet. I'm too young. → I'm not ___ enough.", topic: "not enough",
        options: ["young", "old", "tall", "big"], answer: 1 },
      { q: "I don't like this building. It's not modern. → It's too ___.", topic: "too + adj",
        options: ["new", "modern", "old-fashioned", "tall"], answer: 2 },
      { q: "I prefer a big city. This town is too small. → It's not ___ enough.", topic: "not enough",
        options: ["small", "big", "old", "new"], answer: 1 },
      { q: "The pavements are not wide enough. → They are too ___.", topic: "too + adj",
        options: ["wide", "narrow", "short", "high"], answer: 1 },
      { q: "These buildings are too dark. → These buildings aren't ___ enough.", topic: "not enough",
        options: ["dark", "bright", "tall", "new"], answer: 1 },
      { q: "You can't see the view from here. The building is too low. → The building is not ___ enough.", topic: "not enough",
        options: ["low", "high", "wide", "new"], answer: 1 },
      { q: "There are ___ cars in the city. There isn't enough space for them all.", topic: "too many",
        options: ["too much", "too few", "too many", "enough"], answer: 2 },
      { q: "They can't all park, because there are ___ parking spaces available.", topic: "too few",
        options: ["too much", "too few", "too many", "enough"], answer: 1 },
      { q: "There is ___ pollution in the city. We need to find a solution to this problem.", topic: "too much",
        options: ["too many", "too few", "too much", "more"], answer: 2 },
      { q: "___ people drive cars. It's bad for the environment.", topic: "Too many",
        options: ["Too much", "Too few", "Too many", "Enough"], answer: 2 },
      { q: "___ people should use bicycles.", topic: "More",
        options: ["Too much", "Too few", "More", "Enough"], answer: 2 },

      // ---- Articles + quantifiers ----
      { q: "One of ___ best places for tourists to visit in Syria is the Old City.", topic: "the",
        options: ["a", "an", "the", "(nothing)"], answer: 2 },
      { q: "It is in ___ centre of Damascus.", topic: "the",
        options: ["a", "the", "an", "(nothing)"], answer: 1 },
      { q: "It includes ___ wonderful old covered market called Souq al-Hamadiyyeh.", topic: "a / an",
        options: ["the", "an", "a", "(nothing)"], answer: 2 },
      { q: "Today it is ___ popular tourist destination and ___ favourite location for foreigners.", topic: "a / an",
        options: ["the / the", "a / a", "an / an", "the / a"], answer: 1 },
      { q: "Who ate ___ the biscuits? The packet is empty!", topic: "all",
        options: ["some", "any", "all", "many"], answer: 2 },
      { q: "I haven't got ___ news about my exam results yet.", topic: "any",
        options: ["some", "any", "all", "many"], answer: 1 },
      { q: "There is still ___ water left in the jug.", topic: "some",
        options: ["any", "some", "many", "much"], answer: 1 },
      { q: "___ people in Switzerland can speak Romansh, but not many.", topic: "Some",
        options: ["Any", "Some", "All", "Much"], answer: 1 },
      { q: "Hardly ___ plants are able to survive in the icy Antarctic.", topic: "any",
        options: ["some", "all", "any", "much"], answer: 2 },
      { q: "Not ___ people know that Sir Edmund Hilary was born in New Zealand.", topic: "many",
        options: ["any", "much", "many", "some"], answer: 2 },

      // ---- Too much / too many / too few / (not) enough / more ----
      { q: "___ rain will damage the crops.", topic: "Too much",
        options: ["Too few", "Too many", "Too much", "Many"], answer: 2 },
      { q: "I'm sorry, I can't buy a ticket, because it costs ___ and I haven't got ___ money.", topic: "too much / enough",
        options: ["too much / enough", "too many / enough", "enough / too much", "too few / more"], answer: 0 },
      { q: "There are already eight hotels in the town, and they are planning to build ___ in future.", topic: "more",
        options: ["enough", "too few", "more", "much"], answer: 2 },
      { q: "You can't cycle on the pavements, because they are not wide ___ for pedestrians as well as bicycles.", topic: "enough",
        options: ["too", "much", "enough", "more"], answer: 2 },
    ]
  },

  /* ===================================================================
     TEST 3 — Past Perfect + who/which + Conditionals (Modules 3–4)
     =================================================================== */
  test3: {
    title: "اختبار 3 — Past Perfect · who/which · Conditionals",
    questions: [
      // ---- Past Perfect simple (Unit 6) ----
      { q: "A tourist stopped to ask me for directions. He ___ his map.", topic: "Past Perfect",
        options: ["lost", "was losing", "had lost", "has lost"], answer: 2 },
      { q: "Hussein had a stomachache. He ___ too many sweets.", topic: "Past Perfect",
        options: ["ate", "had eaten", "was eating", "has eaten"], answer: 1 },
      { q: "They weren't home when I rang them. They ___ already gone out.", topic: "Past Perfect",
        options: ["have", "had", "was", "were"], answer: 1 },
      { q: "Our team lost the match. We ___ enough.", topic: "Past Perfect (neg)",
        options: ["didn't practise", "hadn't practised", "haven't practised", "weren't practising"], answer: 1 },
      { q: "When we went to the restaurant, we realised that it ___ down.", topic: "Past Perfect",
        options: ["closed", "was closing", "had closed", "has closed"], answer: 2 },
      { q: "Before she went to school, Carol ___ to speak three languages.", topic: "Past Perfect",
        options: ["learnt", "had learnt", "has learnt", "was learning"], answer: 1 },
      { q: "By the time she was 21, she ___ married.", topic: "Past Perfect",
        options: ["got", "had got", "was getting", "gets"], answer: 1 },
      { q: "When I arrived at the restaurant, my friends ___.", topic: "Past Perfect",
        options: ["left", "had left", "were leaving", "have left"], answer: 1 },
      { q: "He looked so different, because he ___ a moustache.", topic: "Past Perfect",
        options: ["grew", "had grown", "was growing", "has grown"], answer: 1 },
      { q: "After the lesson ___, I spoke to the teacher.", topic: "Past Perfect",
        options: ["ended", "had ended", "was ending", "has ended"], answer: 1 },
      { q: "They were late, because their car ___ down on the way.", topic: "Past Perfect",
        options: ["broke", "had broken", "was breaking", "has broken"], answer: 1 },

      // ---- Mark / Uganda passage ----
      { q: "When Mark ___ his university studies, he went to work in Uganda.", topic: "Past Perfect",
        options: ["finished", "had finished", "has finished", "was finishing"], answer: 1 },
      { q: "A few months earlier, he ___ about a project there.", topic: "Past Perfect",
        options: ["read", "had read", "was reading", "has read"], answer: 1 },
      { q: "A charity ___ building schools in villages and they needed more volunteers.", topic: "Past Perfect",
        options: ["started", "had started", "has started", "was starting"], answer: 1 },
      { q: "When Mark ___ in Uganda, he was surprised to see how much the charity had already done.", topic: "Past Simple",
        options: ["arrives", "arrived", "had arrived", "has arrived"], answer: 1 },
      { q: "They ___ trees to make space for the school.", topic: "Past Perfect",
        options: ["cleared", "were clearing", "had cleared", "have cleared"], answer: 2 },
      { q: "They ___ a well to create a water supply for the school.", topic: "Past Perfect",
        options: ["dug", "had dug", "were digging", "have dug"], answer: 1 },
      { q: "They ___ a teacher.", topic: "Past Perfect",
        options: ["employ", "employed", "had employed", "have employed"], answer: 2 },
      { q: "The children had never ___ in a classroom before, only outside.", topic: "Past Perfect",
        options: ["study", "studied", "been studying", "had studied"], answer: 1 },
      { q: "Mark ___ to stay for a year, but after the year ended, he decided to stay longer.", topic: "Past Perfect",
        options: ["planned", "had planned", "has planned", "was planning"], answer: 1 },
      { q: "He said he ___ never felt so useful and so satisfied with a job before.", topic: "Past Perfect",
        options: ["has", "had", "was", "is"], answer: 1 },

      // ---- Bananas/spider story ----
      { q: "A few weeks ago, a woman ___ some bananas.", topic: "Past Simple",
        options: ["bought", "had bought", "buys", "was buying"], answer: 0 },
      { q: "When she ___ her hand into the bag to eat one, a spider suddenly bit her.", topic: "Past Simple",
        options: ["puts", "put", "had put", "was putting"], answer: 1 },
      { q: "By the time she got to hospital, she ___ very ill.", topic: "Past Perfect",
        options: ["became", "has become", "had become", "was becoming"], answer: 2 },
      { q: "Luckily, she ___ a photo of the spider on her mobile phone.", topic: "Past Perfect",
        options: ["took", "had taken", "was taking", "has taken"], answer: 1 },
      { q: "The doctors ___ the photo to an expert.", topic: "Past Simple",
        options: ["send", "sent", "had sent", "have sent"], answer: 1 },
      { q: "After he ___ it, they could choose the correct medicine.", topic: "Past Perfect",
        options: ["identified", "had identified", "was identifying", "has identified"], answer: 1 },
      { q: "The spider ___ in the bananas as they made their way across the seas.", topic: "Past Perfect",
        options: ["hid", "had hidden", "was hiding", "has hidden"], answer: 1 },

      // ---- who / which (Unit 7) ----
      { q: "Titanic, ___ was made a few years ago, is one of my favourite films.", topic: "which",
        options: ["who", "which", "where", "when"], answer: 1 },
      { q: "Dina, ___ is a very good cook, made me a delicious cake.", topic: "who",
        options: ["who", "which", "what", "whose"], answer: 0 },
      { q: "The Great Wall of China, ___ is 3,460 km long, is the longest wall in the world.", topic: "which",
        options: ["who", "which", "where", "when"], answer: 1 },
      { q: "I went to the dentist, ___ told me I should eat less sugar.", topic: "who",
        options: ["which", "who", "what", "whose"], answer: 1 },
      { q: "The new restaurant, ___ was once a cinema, is very popular.", topic: "which",
        options: ["who", "which", "where", "when"], answer: 1 },
      { q: "I'm afraid Dr Tareq, ___ examined you last time, isn't here today.", topic: "who",
        options: ["which", "who", "where", "when"], answer: 1 },

      // ---- 2nd Conditional (Unit 8) ----
      { q: "If she wanted me to help her, she ___ me.", topic: "2nd Conditional",
        options: ["asks", "would ask", "will ask", "asked"], answer: 1 },
      { q: "I ___ it if you asked me.", topic: "2nd Conditional",
        options: ["will do", "would do", "do", "did"], answer: 1 },
      { q: "If I broke my mother's vase, she ___ very angry.", topic: "2nd Conditional",
        options: ["is", "will be", "would be", "was"], answer: 2 },
      { q: "You ___ so tired if you went to bed earlier.", topic: "2nd Conditional",
        options: ["won't be", "wouldn't be", "aren't", "weren't"], answer: 1 },
      { q: "If I left my homework at home, I ___ into trouble.", topic: "2nd Conditional",
        options: ["will get", "would get", "get", "got"], answer: 1 },
      { q: "I would go to the zoo if I ___ some money.", topic: "2nd Conditional",
        options: ["have", "had", "would have", "has"], answer: 1 },
      { q: "If my brother ___ me his games, I wouldn't have to buy them myself.", topic: "2nd Conditional",
        options: ["lent", "lends", "will lend", "lend"], answer: 0 },
      { q: "If you offered to lend him some of your games, maybe he ___ bad.", topic: "2nd Conditional",
        options: ["will feel", "feels", "would feel", "felt"], answer: 2 },
      { q: "If you knew my brother better, you ___ that!", topic: "2nd Conditional",
        options: ["wouldn't say", "won't say", "don't say", "didn't say"], answer: 0 },

      // ---- 1st Conditional + time clauses (Unit 9) ----
      { q: "If I ___ late, I will phone you.", topic: "1st Conditional",
        options: ["am", "was", "will be", "be"], answer: 0 },
      { q: "If I go shopping, I ___ some new pens.", topic: "1st Conditional",
        options: ["buy", "will buy", "would buy", "bought"], answer: 1 },
      { q: "I will go by bus if I ___ the train.", topic: "1st Conditional",
        options: ["miss", "will miss", "missed", "would miss"], answer: 0 },
      { q: "I'll phone you ___ I arrive.", topic: "Time clauses",
        options: ["until", "as soon as", "before", "since"], answer: 1 },
      { q: "I always brush my teeth ___ I go to bed.", topic: "Time clauses",
        options: ["until", "as soon as", "before", "since"], answer: 2 },
      { q: "If I were you, I ___ comfortable clothing.", topic: "Advice (If I were you)",
        options: ["will wear", "would wear", "wear", "wore"], answer: 1 },
    ]
  },

  /* ===================================================================
     TEST 4 — Passive · Perfect Cont · Tags · 3rd Conditional · Wishes
                (Modules 5–6)
     =================================================================== */
  test4: {
    title: "اختبار 4 — Passive · Perfect · Tags · Wishes",
    questions: [
      // ---- Choose correct passive (Unit 10) ----
      { q: "This painting ___ by Monet in the 19th century.", topic: "Past Passive",
        options: ["is", "was", "is being", "was being"], answer: 1 },
      { q: "The ancient pyramids ___ by the Egyptians.", topic: "Past Passive",
        options: ["were built", "are built", "are being built", "were building"], answer: 0 },
      { q: "Today, millions of mobile phone calls ___ every second.", topic: "Present Passive",
        options: ["were made", "are made", "make", "are making"], answer: 1 },
      { q: "Traditionally on this day, special food ___ eaten, and this is still the case today.", topic: "Past Passive (mixed)",
        options: ["can be", "is being", "was", "were"], answer: 2 },
      { q: "Exams in Syria ___ usually done at the end of each school semester.", topic: "Present Passive",
        options: ["is", "was", "are", "were"], answer: 2 },

      // ---- Passive paragraph: Paper ----
      { q: "Paper ___ as early as 3000 BC in Egypt.", topic: "Past Passive",
        options: ["first produced", "was first produced", "is first produced", "first produces"], answer: 1 },
      { q: "Paper ___ from a plant called papyrus.", topic: "Past Passive",
        options: ["made", "was made", "is made", "makes"], answer: 1 },
      { q: "Later, papyrus ___ by sheep skin or calf skin.", topic: "Past Passive",
        options: ["replaced", "was replaced", "is replaced", "replacing"], answer: 1 },
      { q: "The skins ___ first stretched, then dried to make them hard.", topic: "Past Passive",
        options: ["was", "were", "are", "have"], answer: 1 },
      { q: "In China, writing ___ on bamboo.", topic: "Past Passive",
        options: ["is done", "was done", "did", "does"], answer: 1 },
      { q: "Silk ___ also used, but it was very expensive.", topic: "Past Passive",
        options: ["is", "was", "were", "been"], answer: 1 },
      { q: "The idea for making paper from wood ___ in China.", topic: "Past Passive",
        options: ["developed", "was developed", "is developed", "develops"], answer: 1 },
      { q: "Today, paper ___ to be one of the great Chinese inventions.", topic: "Present Passive",
        options: ["is considered", "was considered", "considered", "considering"], answer: 0 },
      { q: "Wheat straw and sugar cane ___.", topic: "Modal Passive",
        options: ["can use", "can be used", "can be use", "is using"], answer: 1 },

      // ---- Theatre rules — modal passive ----
      { q: "Food and drink can't ___ into the theatre.", topic: "Modal Passive",
        options: ["take", "be taken", "be take", "taking"], answer: 1 },
      { q: "Ticket holders ___ to enter the theatre after a play has started.", topic: "Passive (rules)",
        options: ["aren't allowed", "don't allow", "weren't allow", "isn't allowed"], answer: 0 },
      { q: "Mobile phones can't ___ during the performance.", topic: "Modal Passive",
        options: ["use", "be use", "be used", "used"], answer: 2 },

      // ---- Present / Past passive (Unit 11) ----
      { q: "The telephone ___ by Alexander Graham Bell in 1876.", topic: "Past Passive",
        options: ["is invented", "was invented", "invented", "was inventing"], answer: 1 },
      { q: "The game of basketball ___ of by James Naismith, a Canadian.", topic: "Past Passive",
        options: ["was first thought", "is first thought", "first thought", "first thinks"], answer: 0 },
      { q: "Nowadays, basketball ___ all over the world.", topic: "Present Passive",
        options: ["plays", "played", "is played", "was played"], answer: 2 },
      { q: "A lot of the world's gold ___ in South Africa.", topic: "Present Passive",
        options: ["is still produced", "was still produced", "still produces", "still produced"], answer: 0 },
      { q: "Penicillin ___ by Alexander Fleming.", topic: "Past Passive",
        options: ["is discovered", "was discovered", "discovered", "was discovering"], answer: 1 },
      { q: "In the past, most letters ___ by hand.", topic: "Past Passive",
        options: ["are written", "were written", "wrote", "write"], answer: 1 },
      { q: "Nowadays, computers ___ for letters.", topic: "Present Passive",
        options: ["used", "are used", "were used", "use"], answer: 1 },
      { q: "Every year, a lot of money ___ by people sending each other greeting cards.", topic: "Present Passive",
        options: ["is spent", "was spent", "spent", "spends"], answer: 0 },

      // ---- Khaled's letter — present perfect simple/continuous ----
      { q: "Dear Mum and Dad, I ___ a wonderful time here on the farm!", topic: "Present Perfect",
        options: ["am having", "have had", "had", "had had"], answer: 1 },
      { q: "You won't believe how early I ___ up!", topic: "Present Perfect Cont.",
        options: ["am getting", "have been getting", "got", "had got"], answer: 1 },
      { q: "At the end of such busy days, I ___ asleep quite early, too.", topic: "Present Perfect Cont.",
        options: ["am falling", "have been falling", "fell", "had fallen"], answer: 1 },
      { q: "For the last few days, Uncle Robert ___ me to milk the cows.", topic: "Present Perfect Cont.",
        options: ["teaches", "has been teaching", "taught", "was teaching"], answer: 1 },
      { q: "We ___ back from a ride across the fields on one of the horses.", topic: "Present Perfect (just)",
        options: ["have just come", "just came", "had just come", "just come"], answer: 0 },
      { q: "It ___ for the last few days, and the fields are very wet and muddy.", topic: "Present Perfect Cont.",
        options: ["rains", "has been raining", "rained", "was raining"], answer: 1 },
      { q: "I ___ a very relaxing hour in a hot bath!", topic: "Present Perfect (just)",
        options: ["have just spent", "just spent", "had just spent", "just spend"], answer: 0 },
      { q: "I ___ my mind about the countryside.", topic: "Present Perfect",
        options: ["changed", "have changed", "am changing", "had changed"], answer: 1 },
      { q: "This is the best holiday I ___.", topic: "Present Perfect",
        options: ["ever had", "have ever had", "had ever had", "ever have"], answer: 1 },

      // ---- Circle correct tense ----
      { q: "Your eyes are red. Have you ___?", topic: "Present Perfect Cont.",
        options: ["cried", "been crying", "cry", "been cried"], answer: 1 },
      { q: "For the past three weeks, I've ___ a very sad story.", topic: "Present Perfect Cont.",
        options: ["read", "been reading", "reading", "been read"], answer: 1 },
      { q: "Phew! I'm so tired! I have ___ the house all day. I've just finished.", topic: "Present Perfect Cont.",
        options: ["cleaned", "been cleaning", "cleaning", "been cleaned"], answer: 1 },
      { q: "It's 10 a.m. and you've only just ___ up! You must have gone to bed very late last night.", topic: "Present Perfect",
        options: ["woken", "been waking", "woke", "been woken"], answer: 0 },
      { q: "I hope our team wins today. We've ___ hard all week.", topic: "Present Perfect Cont.",
        options: ["practised", "been practising", "practising", "been practised"], answer: 1 },

      // ---- Question tags ----
      { q: "You aren't going to the shops, ___?", topic: "Question Tag",
        options: ["aren't you", "are you", "do you", "don't you"], answer: 1 },
      { q: "That's our new teacher, ___?", topic: "Question Tag",
        options: ["is it", "isn't it", "doesn't it", "does it"], answer: 1 },
      { q: "Alexander's parents are both doctors, ___?", topic: "Question Tag",
        options: ["aren't they", "are they", "don't they", "do they"], answer: 0 },
      { q: "You've been to Paris and Rome, ___?", topic: "Question Tag",
        options: ["have you", "haven't you", "did you", "didn't you"], answer: 1 },
      { q: "That couldn't possibly be true, ___?", topic: "Question Tag",
        options: ["could it", "couldn't it", "can it", "did it"], answer: 0 },
      { q: "It takes a long time to fly to Australia, ___?", topic: "Question Tag",
        options: ["does it", "doesn't it", "is it", "isn't it"], answer: 1 },
      { q: "Most students in Britain have lunch at school, ___?", topic: "Question Tag",
        options: ["have they", "haven't they", "don't they", "do they"], answer: 2 },
      { q: "I can sit here, ___?", topic: "Question Tag",
        options: ["can I", "can't I", "do I", "don't I"], answer: 1 },

      // ---- Third Conditional + Wishes ----
      { q: "If our football team hadn't lost three matches, we ___ the Cup.", topic: "3rd Conditional",
        options: ["would win", "would have won", "won", "had won"], answer: 1 },
      { q: "If Sally ___, she would have passed her test.", topic: "3rd Conditional",
        options: ["studied", "had studied", "would study", "studies"], answer: 1 },
      { q: "If you had asked me, I ___ you.", topic: "3rd Conditional",
        options: ["would help", "would have helped", "helped", "had helped"], answer: 1 },
      { q: "I wish I ___ all my money on new clothes.", topic: "Wish (past)",
        options: ["didn't spend", "hadn't spent", "wouldn't spend", "don't spend"], answer: 1 },
      { q: "I wish I ___ the book before I saw the film.", topic: "Wish (past)",
        options: ["read", "had read", "would read", "have read"], answer: 1 },
    ]
  },

  /* ===================================================================
     TEST 5 — Ask about underlined words  +  Choose the wrong part
                (50 questions: 25 + 25)
     =================================================================== */
  test5: {
    title: "اختبار 5 — Ask underlined · Choose wrong part",
    questions: [
      /* ----- Section D — Ask about the underlined word(s) -----
              The student picks the correct WH-question. */
      { type: "underlined", section: "D",
        before: "Rami is in hospital ", under: "because he is sick", after: ".",
        options: ["When is Rami in hospital?", "Why is Rami in hospital?",
                  "How is Rami in hospital?", "Where is Rami in hospital?"],
        answer: 1, topic: "Why" },

      { type: "underlined", section: "D",
        before: "I usually go to school ", under: "by bus", after: ".",
        options: ["Where do you usually go?", "Why do you go to school?",
                  "How do you usually go to school?", "When do you go to school?"],
        answer: 2, topic: "How" },

      { type: "underlined", section: "D",
        before: "Nada visits her uncle ", under: "twice a week", after: ".",
        options: ["When does Nada visit her uncle?", "How often does Nada visit her uncle?",
                  "How long does Nada visit her uncle?", "Why does Nada visit her uncle?"],
        answer: 1, topic: "How often" },

      { type: "underlined", section: "D",
        before: "I will travel ", under: "to France", after: " with my family.",
        options: ["When will you travel?", "Who will you travel with?",
                  "Why will you travel?", "Where will you travel with your family?"],
        answer: 3, topic: "Where" },

      { type: "underlined", section: "D",
        before: "", under: "Carol", after: " learnt to speak three languages before she went to school.",
        options: ["Who learnt to speak three languages?", "What did Carol learn?",
                  "When did Carol learn three languages?", "Where did Carol learn three languages?"],
        answer: 0, topic: "Who (subject)" },

      { type: "underlined", section: "D",
        before: "Carol learnt to speak ", under: "three", after: " languages.",
        options: ["What did Carol learn?", "How many languages did Carol learn?",
                  "How long did Carol learn?", "Why did Carol learn languages?"],
        answer: 1, topic: "How many" },

      { type: "underlined", section: "D",
        before: "Mark went to work ", under: "in Uganda", after: ".",
        options: ["When did Mark go to work?", "Why did Mark go to work?",
                  "Where did Mark go to work?", "How did Mark go to work?"],
        answer: 2, topic: "Where" },

      { type: "underlined", section: "D",
        before: "Mark planned to stay ", under: "for a year", after: ".",
        options: ["When did Mark plan to stay?", "Where did Mark plan to stay?",
                  "Why did Mark plan to stay?", "How long did Mark plan to stay?"],
        answer: 3, topic: "How long" },

      { type: "underlined", section: "D",
        before: "The Great Wall of China is ", under: "3,460 km", after: " long.",
        options: ["How long is the Great Wall of China?", "Where is the Great Wall of China?",
                  "When was the Great Wall built?", "Why is the Great Wall famous?"],
        answer: 0, topic: "How long (length)" },

      { type: "underlined", section: "D",
        before: "The telephone was invented by ", under: "Alexander Graham Bell", after: ".",
        options: ["When was the telephone invented?", "What was invented?",
                  "Who was the telephone invented by?", "Where was the telephone invented?"],
        answer: 2, topic: "Who (by)" },

      { type: "underlined", section: "D",
        before: "Penicillin was discovered by ", under: "Alexander Fleming", after: ".",
        options: ["Who discovered penicillin?", "When was penicillin discovered?",
                  "Where was penicillin discovered?", "Why was penicillin discovered?"],
        answer: 0, topic: "Who" },

      { type: "underlined", section: "D",
        before: "Naser was riding his bike ", under: "when he fell off", after: ".",
        options: ["Where was Naser riding his bike?", "When was Naser riding his bike?",
                  "How was Naser riding his bike?", "Why was Naser riding his bike?"],
        answer: 1, topic: "When" },

      { type: "underlined", section: "D",
        before: "He studies at ", under: "Damascus University", after: " this year.",
        options: ["What does he study?", "Where does he study?",
                  "When does he study?", "Who does he study with?"],
        answer: 1, topic: "Where" },

      { type: "underlined", section: "D",
        before: "They were late because ", under: "their car broke down on the way", after: ".",
        options: ["When were they late?", "How were they late?",
                  "Why were they late?", "Where were they late?"],
        answer: 2, topic: "Why" },

      { type: "underlined", section: "D",
        before: "She got married when she was ", under: "21", after: ".",
        options: ["Why did she get married?", "How old was she when she got married?",
                  "Where did she get married?", "Who did she get married to?"],
        answer: 1, topic: "How old" },

      { type: "underlined", section: "D",
        before: "I am learning about ", under: "Ancient Greece", after: " in History this year.",
        options: ["Where are you learning?", "When are you learning?",
                  "What are you learning about in History?", "Why are you learning History?"],
        answer: 2, topic: "What" },

      { type: "underlined", section: "D",
        before: "We are visiting ", under: "all the famous places", after: " in London.",
        options: ["Why are you visiting London?", "When are you visiting London?",
                  "What are you visiting in London?", "How are you visiting London?"],
        answer: 2, topic: "What" },

      { type: "underlined", section: "D",
        before: "Yesterday we went to ", under: "Covent Garden Market", after: ".",
        options: ["When did you go shopping?", "Where did you go yesterday?",
                  "Why did you go to the market?", "How did you go to the market?"],
        answer: 1, topic: "Where" },

      { type: "underlined", section: "D",
        before: "I lost some money ", under: "earlier this evening", after: ".",
        options: ["Where did you lose the money?", "When did you lose the money?",
                  "How did you lose the money?", "Why did you lose the money?"],
        answer: 1, topic: "When" },

      { type: "underlined", section: "D",
        before: "My grandfather used to walk ", under: "a long way", after: " to school every day.",
        options: ["Where did your grandfather walk?", "How far did your grandfather walk to school?",
                  "When did your grandfather walk?", "Why did your grandfather walk?"],
        answer: 1, topic: "How far" },

      { type: "underlined", section: "D",
        before: "They had candles on their tables ", under: "so that they could see", after: ".",
        options: ["Where did they have candles?", "When did they have candles?",
                  "Why did they have candles on their tables?", "How did they have candles?"],
        answer: 2, topic: "Why" },

      { type: "underlined", section: "D",
        before: "", under: "Susan", after: " went into the garden.",
        options: ["Where did Susan go?", "When did Susan go?",
                  "Who went into the garden?", "Why did Susan go into the garden?"],
        answer: 2, topic: "Who (subject)" },

      { type: "underlined", section: "D",
        before: "He gave Susan ", under: "the key", after: " through the letter box.",
        options: ["Who gave Susan something?", "When did he give Susan something?",
                  "Where did he give Susan the key?", "What did he give Susan?"],
        answer: 3, topic: "What" },

      { type: "underlined", section: "D",
        before: "Mary should study hard ", under: "before the exam", after: ".",
        options: ["What should Mary study?", "When should Mary study hard?",
                  "Why should Mary study hard?", "How should Mary study?"],
        answer: 1, topic: "When" },

      { type: "underlined", section: "D",
        before: "I have lived in this city ", under: "for nine years", after: ".",
        options: ["Where have you lived?", "When have you lived in this city?",
                  "Why have you lived in this city?", "How long have you lived in this city?"],
        answer: 3, topic: "How long" },


      /* ----- Section E — Choose the wrong part in each sentence -----
              parts[]: the 4 underlined parts in order (a, b, c, d).
              answer : index (0..3) of the WRONG part.                  */

      { type: "wrong", section: "E",
        parts: ["He goes", "to the park", "every", "thursday"],
        answer: 3, topic: "Capitalization",
        hint: "Days of the week start with a capital letter (Thursday)." },

      { type: "wrong", section: "E",
        parts: ["Mine", "father reads", "a", "book at night"],
        answer: 0, topic: "Possessive",
        hint: "Use 'My' before a noun, not 'Mine'." },

      { type: "wrong", section: "E",
        parts: ["I have", "lived in", "this city", "for nine year"],
        answer: 3, topic: "Plural",
        hint: "After numbers > 1, use plural: 'years'." },

      { type: "wrong", section: "E",
        parts: ["Mary should", "studied", "hard before", "the exam"],
        answer: 1, topic: "Modal + V1",
        hint: "After 'should' use the base form: 'study'." },

      { type: "wrong", section: "E",
        parts: ["She doesn't", "likes", "coffee", "or tea"],
        answer: 1, topic: "Subject-verb",
        hint: "After 'doesn't' use the base form: 'like'." },

      { type: "wrong", section: "E",
        parts: ["They was", "playing football", "when it", "started to rain"],
        answer: 0, topic: "Past Continuous (be)",
        hint: "Use 'were' with 'they'." },

      { type: "wrong", section: "E",
        parts: ["He didn't", "went", "to school", "yesterday"],
        answer: 1, topic: "Past Simple (aux)",
        hint: "After 'didn't' use the base form: 'go'." },

      { type: "wrong", section: "E",
        parts: ["There is", "too much cars", "on the", "road"],
        answer: 1, topic: "too many / too much",
        hint: "Use 'too many' with countable nouns (cars)." },

      { type: "wrong", section: "E",
        parts: ["If I were you,", "I will", "study hard", "for the exam"],
        answer: 1, topic: "2nd Conditional",
        hint: "Use 'would' (not 'will') in the second conditional." },

      { type: "wrong", section: "E",
        parts: ["She has", "two", "brother", "and one sister"],
        answer: 2, topic: "Plural",
        hint: "After 'two', use the plural form: 'brothers'." },

      { type: "wrong", section: "E",
        parts: ["The cake", "was eaten", "by", "we"],
        answer: 3, topic: "Object pronoun",
        hint: "After 'by', use the object pronoun: 'us'." },

      { type: "wrong", section: "E",
        parts: ["I have", "been waiting", "for you", "since two hours"],
        answer: 3, topic: "for / since",
        hint: "Use 'for' with a duration (for two hours)." },

      { type: "wrong", section: "E",
        parts: ["My brother is", "more taller", "than", "me"],
        answer: 1, topic: "Comparative",
        hint: "Comparative of 'tall' is 'taller' (not 'more taller')." },

      { type: "wrong", section: "E",
        parts: ["Ahmed and me", "went to", "the cinema", "yesterday"],
        answer: 0, topic: "Subject pronoun",
        hint: "Use the subject pronoun: 'Ahmed and I'." },

      { type: "wrong", section: "E",
        parts: ["Look! The baby", "cries", "in the", "cradle"],
        answer: 1, topic: "Present Continuous",
        hint: "After 'Look!' use Present Continuous: 'is crying'." },

      { type: "wrong", section: "E",
        parts: ["Me and my friend", "go", "to school", "by bus"],
        answer: 0, topic: "Subject pronoun",
        hint: "Use 'My friend and I' (subject form, polite order)." },

      { type: "wrong", section: "E",
        parts: ["There is", "some apples", "on the", "table"],
        answer: 0, topic: "There is / are",
        hint: "Use 'There are' with plural nouns (apples)." },

      { type: "wrong", section: "E",
        parts: ["He is", "the", "most tallest", "boy in his class"],
        answer: 2, topic: "Superlative",
        hint: "Use only 'the tallest' (not 'the most tallest')." },

      { type: "wrong", section: "E",
        parts: ["She is", "a English teacher", "in", "our school"],
        answer: 1, topic: "a / an",
        hint: "Use 'an' before a vowel sound: 'an English teacher'." },

      { type: "wrong", section: "E",
        parts: ["I am born", "in", "Damascus", "in 2010"],
        answer: 0, topic: "Passive (past)",
        hint: "Use 'I was born' (past passive)." },

      { type: "wrong", section: "E",
        parts: ["He plays", "football very", "good", "and his team wins"],
        answer: 2, topic: "Adverb",
        hint: "Use the adverb 'well' (not 'good') with a verb." },

      { type: "wrong", section: "E",
        parts: ["The exam", "was easyer", "than", "we expected"],
        answer: 1, topic: "Comparative spelling",
        hint: "Comparative of 'easy' is 'easier' (y → i)." },

      { type: "wrong", section: "E",
        parts: ["He is one", "of the best", "student", "in our school"],
        answer: 2, topic: "one of the + plural",
        hint: "'one of the best ...' takes a plural noun: 'students'." },

      { type: "wrong", section: "E",
        parts: ["I will travel", "to Paris", "next year", "if I will have money"],
        answer: 3, topic: "1st Conditional",
        hint: "After 'if' use Present Simple (have), not 'will have'." },

      { type: "wrong", section: "E",
        parts: ["This is the", "book", "which I bought", "it yesterday"],
        answer: 3, topic: "Relative clauses",
        hint: "After 'which I bought' do not repeat the object 'it'." }
    ]
  }
};


/* =====================================================================
   Rendering / app logic
   ===================================================================== */
const questionsEl   = document.getElementById("questions");
const scoreChipEl   = document.getElementById("scoreChip");
const testTitleEl   = document.getElementById("testTitle");
const progressFillEl = document.getElementById("progressFill");
const resetBtn      = document.getElementById("resetBtn");
const tabs          = document.querySelectorAll(".tab");

let currentTestId = "test1";
const answeredState = {};   // { test1: { 0: {chosen, correct}, ... } }

function getState(testId) {
  if (!answeredState[testId]) answeredState[testId] = {};
  return answeredState[testId];
}

function updateScore() {
  const state = getState(currentTestId);
  const total = tests[currentTestId].questions.length;
  let correct = 0, answered = 0;
  for (const k in state) {
    answered++;
    if (state[k].correct) correct++;
  }
  scoreChipEl.textContent = `${correct} / ${total}  (${answered} مُجاب)`;
  progressFillEl.style.width = (answered / total * 100) + "%";
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderTest(testId) {
  currentTestId = testId;
  const test = tests[testId];
  testTitleEl.textContent = test.title;

  questionsEl.innerHTML = "";
  const state = getState(testId);

  // Track section dividers for test 5
  let lastSection = null;

  test.questions.forEach((q, idx) => {
    // Add divider if section changes (test 5)
    if (q.section && q.section !== lastSection) {
      const div = document.createElement("div");
      div.className = "section-divider";
      div.textContent = q.section === "D"
        ? "Section D — Ask about the underlined word(s) in each sentence"
        : "Section E — Choose the wrong part in each sentence";
      questionsEl.appendChild(div);
      lastSection = q.section;
    }

    const card = document.createElement("article");
    card.className = "qcard";

    // Build head (number only — topic intentionally hidden so it doesn't give a hint)
    const headHtml = `
      <div class="qhead">
        <span class="qnum">${idx + 1}.</span>
      </div>
    `;

    if (q.type === "wrong") {
      // ---- "Choose the wrong part" rendering ----
      const letters = ["a", "b", "c", "d"];
      const hintHtml = `<div class="wp-hint">اختر القسم الذي يحوي الخطأ:</div>`;
      const partsHtml = q.parts.map((p, i) => `
        <span class="wp-part" data-idx="${i}">
          <span class="wp-text">${escapeHtml(p)}</span>
          <span class="wp-label">${letters[i]}</span>
        </span>
      `).join("");

      card.innerHTML = headHtml + hintHtml +
        `<div class="wrong-part-sentence">${partsHtml}</div>`;
      questionsEl.appendChild(card);

      const partEls = card.querySelectorAll(".wp-part");

      if (state[idx] !== undefined) {
        applyWrongPartVisual(partEls, state[idx].chosen, q.answer);
      }

      partEls.forEach(el => {
        el.addEventListener("click", () => {
          if (state[idx] !== undefined) return;
          const chosen = parseInt(el.dataset.idx, 10);
          const correct = chosen === q.answer;
          state[idx] = { chosen, correct };
          applyWrongPartVisual(partEls, chosen, q.answer);
          updateScore();
        });
      });
      return;
    }

    // ---- Other types share the standard MCQ layout ----
    let textHtml = "";
    if (q.type === "underlined") {
      textHtml = `<div class="qtext">${escapeHtml(q.before)}<span class="underlined">${escapeHtml(q.under)}</span>${escapeHtml(q.after)}</div>`;
    } else {
      // standard MCQ (q.q has the sentence)
      // Strip any trailing verb-hint in parentheses, e.g. "(ride)" or "(do — for a living)"
      const cleaned = (q.q || "").replace(/\s*\([^()]*\)\s*$/, "");
      const text = cleaned.replace(/___/g, '<span class="blank">&nbsp;</span>');
      textHtml = `<div class="qtext">${text}</div>`;
    }

    const letters = ["a", "b", "c", "d"];
    const optsHtml = q.options.map((opt, i) => `
      <button class="opt" data-idx="${i}">
        <span class="letter">${letters[i]}-</span>
        <span class="opt-text">${escapeHtml(opt)}</span>
      </button>
    `).join("");

    card.innerHTML = headHtml + textHtml + `<div class="options">${optsHtml}</div>`;
    questionsEl.appendChild(card);

    const optBtns = card.querySelectorAll(".opt");

    if (state[idx] !== undefined) {
      applyAnswerVisual(optBtns, state[idx].chosen, q.answer);
    }

    optBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (state[idx] !== undefined) return;
        const chosen = parseInt(btn.dataset.idx, 10);
        const correct = chosen === q.answer;
        state[idx] = { chosen, correct };
        applyAnswerVisual(optBtns, chosen, q.answer);
        updateScore();
      });
    });
  });

  updateScore();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyAnswerVisual(optBtns, chosen, correctIdx) {
  optBtns.forEach((b, i) => {
    b.classList.add("disabled");
    if (i === correctIdx) b.classList.add("correct");
    if (i === chosen && chosen !== correctIdx) b.classList.add("wrong");
  });
}

function applyWrongPartVisual(partEls, chosen, correctIdx) {
  partEls.forEach((el, i) => {
    el.style.cursor = "default";
    if (i === correctIdx) el.classList.add("correct");
    if (i === chosen && chosen !== correctIdx) el.classList.add("wrong");
  });
}

// Tabs
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderTest(tab.dataset.test);
  });
});

// Reset current test
resetBtn.addEventListener("click", () => {
  if (!confirm("هل تريد إعادة تعيين إجابات هذا الاختبار؟")) return;
  answeredState[currentTestId] = {};
  renderTest(currentTestId);
});

// Initial render
renderTest("test1");

/* =====================================================================
   Visitor counter — uses the free CounterAPI service (no signup)
   - Each new browser (no localStorage flag) increments the counter once.
   - Subsequent visits from the same browser only READ the count.
   ===================================================================== */
(function loadVisitorCount() {
  const chip = document.getElementById("visitChip");
  if (!chip) return;

  const NAMESPACE = "takatuf-net";
  const KEY = "visits";
  const FLAG = "tkt_visited_v1";
  const alreadyCounted = localStorage.getItem(FLAG) === "1";

  const endpoint = alreadyCounted
    ? `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/`
    : `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`;

  fetch(endpoint)
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => {
      const n = (data && (data.count ?? data.value)) || 0;
      chip.textContent = `👁 ${n.toLocaleString("en-US")} زائر`;
      if (!alreadyCounted) localStorage.setItem(FLAG, "1");
    })
    .catch(() => {
      chip.style.display = "none";
    });
})();
