// Sample games data to seed the database
const sampleGames = [
  // Math Game
  {
    title: "Math Adventure: Addition & Subtraction",
    description: "Learn addition and subtraction through fun interactive problems!",
    subject: "math",
    category: "serious",
    difficulty: "easy",
    ageRange: { min: 5, max: 10 },
    pointsReward: 15,
    estimatedTime: 10,
    content: {
      instructions: "Solve the math problems by selecting the correct answer. Each correct answer earns you points!",
      tasks: [
        {
          question: "What is 5 + 3?",
          options: ["6", "7", "8", "9"],
          correctAnswer: 2,
          explanation: "Great job! 5 + 3 = 8. You add the numbers together."
        },
        {
          question: "What is 10 - 4?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 2,
          explanation: "Excellent! 10 - 4 = 6. You subtract 4 from 10."
        },
        {
          question: "What is 7 + 2?",
          options: ["8", "9", "10", "11"],
          correctAnswer: 1,
          explanation: "Perfect! 7 + 2 = 9."
        },
        {
          question: "What is 15 - 6?",
          options: ["7", "8", "9", "10"],
          correctAnswer: 2,
          explanation: "Well done! 15 - 6 = 9."
        },
        {
          question: "What is 4 + 5?",
          options: ["8", "9", "10", "11"],
          correctAnswer: 1,
          explanation: "Awesome! 4 + 5 = 9."
        }
      ]
    },
    curriculumAlignment: {
      grade: [1, 2],
      topics: ["Addition", "Subtraction", "Basic Arithmetic"]
    },
    isActive: true
  },
  // Physics Game
  {
    title: "Physics Fun: Forces and Motion",
    description: "Discover the basics of physics through interactive questions about forces and motion!",
    subject: "physics",
    category: "serious",
    difficulty: "medium",
    ageRange: { min: 8, max: 14 },
    pointsReward: 20,
    estimatedTime: 15,
    content: {
      instructions: "Answer questions about physics concepts. Learn how forces and motion work in our world!",
      tasks: [
        {
          question: "What force pulls objects toward the Earth?",
          options: ["Magnetism", "Gravity", "Electricity", "Friction"],
          correctAnswer: 1,
          explanation: "Correct! Gravity is the force that pulls objects toward the Earth."
        },
        {
          question: "What happens when you push a ball?",
          options: ["It stops", "It moves", "It disappears", "It changes color"],
          correctAnswer: 1,
          explanation: "Right! When you apply force by pushing, the ball moves."
        },
        {
          question: "What is the unit of force?",
          options: ["Kilogram", "Newton", "Meter", "Second"],
          correctAnswer: 1,
          explanation: "Excellent! Force is measured in Newtons, named after Sir Isaac Newton."
        },
        {
          question: "What makes an object slow down?",
          options: ["Gravity", "Friction", "Speed", "Color"],
          correctAnswer: 1,
          explanation: "Great! Friction is the force that slows down moving objects."
        },
        {
          question: "What is motion?",
          options: ["When something is still", "When something moves", "When something is heavy", "When something is light"],
          correctAnswer: 1,
          explanation: "Perfect! Motion is when an object changes its position over time."
        }
      ]
    },
    curriculumAlignment: {
      grade: [4, 5, 6],
      topics: ["Forces", "Motion", "Gravity", "Friction"]
    },
    isActive: true
  },
  // Chemistry Game
  {
    title: "Chemistry Explorer: Elements & Compounds",
    description: "Explore the amazing world of chemistry and learn about elements and compounds!",
    subject: "chemistry",
    category: "serious",
    difficulty: "medium",
    ageRange: { min: 10, max: 16 },
    pointsReward: 20,
    estimatedTime: 15,
    content: {
      instructions: "Test your knowledge of chemistry! Answer questions about elements, compounds, and chemical reactions.",
      tasks: [
        {
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "O2", "NaCl"],
          correctAnswer: 0,
          explanation: "Correct! H2O is the chemical formula for water - 2 Hydrogen atoms and 1 Oxygen atom."
        },
        {
          question: "What gas do we breathe in?",
          options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"],
          correctAnswer: 1,
          explanation: "Right! We breathe in Oxygen, which our bodies need to function."
        },
        {
          question: "What happens when you mix vinegar and baking soda?",
          options: ["Nothing", "It fizzes and bubbles", "It turns blue", "It freezes"],
          correctAnswer: 1,
          explanation: "Excellent! Mixing vinegar (acid) and baking soda (base) creates a chemical reaction with bubbles!"
        },
        {
          question: "What is the most common element in the air?",
          options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
          correctAnswer: 2,
          explanation: "Great! Nitrogen makes up about 78% of the air we breathe."
        },
        {
          question: "What do we call the smallest unit of an element?",
          options: ["Molecule", "Atom", "Compound", "Mixture"],
          correctAnswer: 1,
          explanation: "Perfect! An atom is the smallest unit of an element that retains its properties."
        }
      ]
    },
    curriculumAlignment: {
      grade: [5, 6, 7],
      topics: ["Elements", "Compounds", "Chemical Reactions", "Atoms"]
    },
    isActive: true
  },
  // Language Game
  {
    title: "Language Master: Grammar & Vocabulary",
    description: "Improve your language skills with fun grammar and vocabulary challenges!",
    subject: "language",
    category: "serious",
    difficulty: "easy",
    ageRange: { min: 6, max: 12 },
    pointsReward: 15,
    estimatedTime: 12,
    content: {
      instructions: "Test your language skills! Answer questions about grammar, vocabulary, and sentence structure.",
      tasks: [
        {
          question: "Which word is a noun?",
          options: ["run", "happy", "cat", "quickly"],
          correctAnswer: 2,
          explanation: "Correct! 'Cat' is a noun - it's a person, place, or thing."
        },
        {
          question: "What is the past tense of 'go'?",
          options: ["goed", "went", "goes", "going"],
          correctAnswer: 1,
          explanation: "Right! 'Went' is the past tense of 'go'."
        },
        {
          question: "Which sentence is correct?",
          options: ["I am happy.", "I is happy.", "I are happy.", "I be happy."],
          correctAnswer: 0,
          explanation: "Excellent! 'I am happy' uses the correct verb form 'am' with 'I'."
        },
        {
          question: "What is a synonym for 'big'?",
          options: ["small", "large", "tiny", "little"],
          correctAnswer: 1,
          explanation: "Great! 'Large' means the same as 'big' - they are synonyms."
        },
        {
          question: "Which word is an adjective?",
          options: ["jump", "beautiful", "quickly", "and"],
          correctAnswer: 1,
          explanation: "Perfect! 'Beautiful' is an adjective - it describes a noun."
        }
      ]
    },
    curriculumAlignment: {
      grade: [2, 3, 4],
      topics: ["Grammar", "Vocabulary", "Parts of Speech", "Sentence Structure"]
    },
    isActive: true
  },
  // Coding Game
  {
    title: "Code Quest: Programming Basics",
    description: "Start your coding journey! Learn programming concepts through fun challenges.",
    subject: "coding",
    category: "serious",
    difficulty: "medium",
    ageRange: { min: 8, max: 16 },
    pointsReward: 25,
    estimatedTime: 20,
    content: {
      instructions: "Learn programming basics! Answer questions about coding concepts, logic, and programming fundamentals.",
      tasks: [
        {
          question: "What do we call a set of instructions for a computer?",
          options: ["A program", "A game", "A website", "A document"],
          correctAnswer: 0,
          explanation: "Correct! A program is a set of instructions that tells a computer what to do."
        },
        {
          question: "What is a variable in programming?",
          options: ["A number", "A container that stores data", "A function", "A loop"],
          correctAnswer: 1,
          explanation: "Right! A variable is like a box that stores information you can use later."
        },
        {
          question: "What does 'if' do in programming?",
          options: ["Repeats code", "Makes decisions", "Stores data", "Displays text"],
          correctAnswer: 1,
          explanation: "Excellent! 'If' statements help programs make decisions based on conditions."
        },
        {
          question: "What is a loop used for?",
          options: ["Storing data", "Repeating code", "Making decisions", "Creating variables"],
          correctAnswer: 1,
          explanation: "Great! Loops repeat code multiple times, which saves time and makes programs efficient."
        },
        {
          question: "What is debugging?",
          options: ["Writing code", "Finding and fixing errors", "Running a program", "Saving a file"],
          correctAnswer: 1,
          explanation: "Perfect! Debugging is the process of finding and fixing mistakes (bugs) in code."
        }
      ]
    },
    curriculumAlignment: {
      grade: [4, 5, 6, 7],
      topics: ["Programming Basics", "Variables", "Conditionals", "Loops", "Debugging"]
    },
    isActive: true
  }
];

module.exports = sampleGames;

