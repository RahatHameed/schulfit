// =============================================================================
// Learning Categories Data
// =============================================================================

import type { Cat } from '../types';

export const CATS: Cat[] = [
  {
    id: 'colors',
    label: 'Farben',
    sublabel: 'Colors',
    icon: 'col',
    emoji: '🎨',
    items: [
      { emoji: '🔴', german: 'Rot', english: 'Red' },
      { emoji: '🔵', german: 'Blau', english: 'Blue' },
      { emoji: '🟢', german: 'Grün', english: 'Green' },
      { emoji: '🟡', german: 'Gelb', english: 'Yellow' },
      { emoji: '🟠', german: 'Orange', english: 'Orange' },
      { emoji: '⚫', german: 'Schwarz', english: 'Black' },
      { emoji: '⚪', german: 'Weiß', english: 'White' },
      { emoji: '🟣', german: 'Lila', english: 'Purple' },
      { emoji: '🩷', german: 'Rosa', english: 'Pink' },
      { emoji: '🟤', german: 'Braun', english: 'Brown' },
      { emoji: '💛', german: 'Gold', english: 'Gold' }
    ]
  },
  {
    id: 'shapes',
    label: 'Formen',
    sublabel: 'Shapes',
    icon: 'sha',
    emoji: '🔷',
    items: [
      { emoji: '🔵', german: 'Kreis', english: 'Circle' },
      { emoji: '🔺', german: 'Dreieck', english: 'Triangle' },
      { emoji: '🟥', german: 'Quadrat', english: 'Square' },
      { emoji: '🔷', german: 'Rechteck', english: 'Rectangle' },
      { emoji: '⭐', german: 'Stern', english: 'Star' },
      { emoji: '❤️', german: 'Herz', english: 'Heart' },
      { emoji: '🔶', german: 'Raute', english: 'Diamond' },
      { emoji: '🥚', german: 'Oval', english: 'Oval' },
      { emoji: '🌙', german: 'Halbmond', english: 'Crescent' },
      { emoji: '➕', german: 'Kreuz', english: 'Cross' }
    ]
  },
  {
    id: 'body',
    label: 'Körper',
    sublabel: 'Body Parts',
    icon: 'bod',
    emoji: '🧒',
    items: [
      { emoji: '👁️', german: 'Augen', english: 'Eyes' },
      { emoji: '👃', german: 'Nase', english: 'Nose' },
      { emoji: '👄', german: 'Mund', english: 'Mouth' },
      { emoji: '👂', german: 'Ohren', english: 'Ears' },
      { emoji: '💇', german: 'Kopf', english: 'Head' },
      { emoji: '🤚', german: 'Hand', english: 'Hand' },
      { emoji: '🦵', german: 'Bein', english: 'Leg' },
      { emoji: '🦶', german: 'Fuß', english: 'Foot' },
      { emoji: '🫁', german: 'Bauch', english: 'Tummy' },
      { emoji: '💪', german: 'Arm', english: 'Arm' },
      { emoji: '🦷', german: 'Zähne', english: 'Teeth' },
      { emoji: '💈', german: 'Haar', english: 'Hair' },
      { emoji: '🫲', german: 'Finger', english: 'Finger' },
      { emoji: '🎽', german: 'Schulter', english: 'Shoulder' },
      { emoji: '🦿', german: 'Knie', english: 'Knee' }
    ]
  },
  {
    id: 'objects',
    label: 'Dinge',
    sublabel: 'Objects',
    icon: 'obj',
    emoji: '🏠',
    items: [
      { emoji: '🍎', german: 'Apfel', english: 'Apple' },
      { emoji: '🐶', german: 'Hund', english: 'Dog' },
      { emoji: '🐱', german: 'Katze', english: 'Cat' },
      { emoji: '🚗', german: 'Auto', english: 'Car' },
      { emoji: '📚', german: 'Buch', english: 'Book' },
      { emoji: '🏠', german: 'Haus', english: 'House' },
      { emoji: '⚽', german: 'Ball', english: 'Ball' },
      { emoji: '🌸', german: 'Blume', english: 'Flower' },
      { emoji: '✏️', german: 'Stift', english: 'Pencil' },
      { emoji: '🪑', german: 'Stuhl', english: 'Chair' },
      { emoji: '🛏️', german: 'Bett', english: 'Bed' },
      { emoji: '💡', german: 'Lampe', english: 'Lamp' },
      { emoji: '☕', german: 'Tasse', english: 'Cup' },
      { emoji: '⏰', german: 'Uhr', english: 'Clock' },
      { emoji: '🔑', german: 'Schlüssel', english: 'Key' },
      { emoji: '📱', german: 'Telefon', english: 'Phone' },
      { emoji: '👟', german: 'Schuh', english: 'Shoe' },
      { emoji: '🌳', german: 'Baum', english: 'Tree' },
      { emoji: '🐦', german: 'Vogel', english: 'Bird' },
      { emoji: '🧸', german: 'Teddy', english: 'Teddy' },
      { emoji: '🎒', german: 'Rucksack', english: 'Backpack' },
      { emoji: '🚪', german: 'Tür', english: 'Door' }
    ]
  },
  {
    id: 'animals',
    label: 'Tiere',
    sublabel: 'Animals',
    icon: 'ani',
    emoji: '🐾',
    items: [
      { emoji: '🐴', german: 'Pferd', english: 'Horse' },
      { emoji: '🐄', german: 'Kuh', english: 'Cow' },
      { emoji: '🐷', german: 'Schwein', english: 'Pig' },
      { emoji: '🐑', german: 'Schaf', english: 'Sheep' },
      { emoji: '🐓', german: 'Huhn', english: 'Chicken' },
      { emoji: '🐇', german: 'Hase', english: 'Rabbit' },
      { emoji: '🦊', german: 'Fuchs', english: 'Fox' },
      { emoji: '🐺', german: 'Wolf', english: 'Wolf' },
      { emoji: '🐻', german: 'Bär', english: 'Bear' },
      { emoji: '🐘', german: 'Elefant', english: 'Elephant' },
      { emoji: '🦁', german: 'Löwe', english: 'Lion' },
      { emoji: '🐯', german: 'Tiger', english: 'Tiger' },
      { emoji: '🐒', german: 'Affe', english: 'Monkey' },
      { emoji: '🐬', german: 'Delfin', english: 'Dolphin' },
      { emoji: '🦅', german: 'Adler', english: 'Eagle' },
      { emoji: '🐸', german: 'Frosch', english: 'Frog' },
      { emoji: '🦋', german: 'Schmetterling', english: 'Butterfly' },
      { emoji: '🐢', german: 'Schildkröte', english: 'Turtle' },
      { emoji: '🦒', german: 'Giraffe', english: 'Giraffe' }
    ]
  },
  {
    id: 'food',
    label: 'Essen',
    sublabel: 'Food',
    icon: 'foo',
    emoji: '🍎',
    items: [
      { emoji: '🍎', german: 'Apfel', english: 'Apple' },
      { emoji: '🍌', german: 'Banane', english: 'Banana' },
      { emoji: '🍓', german: 'Erdbeere', english: 'Strawberry' },
      { emoji: '🥕', german: 'Karotte', english: 'Carrot' },
      { emoji: '🥔', german: 'Kartoffel', english: 'Potato' },
      { emoji: '🍞', german: 'Brot', english: 'Bread' },
      { emoji: '🧀', german: 'Käse', english: 'Cheese' },
      { emoji: '🥛', german: 'Milch', english: 'Milk' },
      { emoji: '🍳', german: 'Ei', english: 'Egg' },
      { emoji: '🍝', german: 'Nudeln', english: 'Noodles' },
      { emoji: '🍰', german: 'Kuchen', english: 'Cake' },
      { emoji: '🍦', german: 'Eis', english: 'Ice cream' },
      { emoji: '💧', german: 'Wasser', english: 'Water' },
      { emoji: '🥤', german: 'Saft', english: 'Juice' },
      { emoji: '🍫', german: 'Schokolade', english: 'Chocolate' }
    ]
  },
  {
    id: 'family',
    label: 'Familie',
    sublabel: 'Family',
    icon: 'fam',
    emoji: '👪',
    items: [
      { emoji: '👩', german: 'Mama', english: 'Mom' },
      { emoji: '👨', german: 'Papa', english: 'Dad' },
      { emoji: '👧', german: 'Schwester', english: 'Sister' },
      { emoji: '👦', german: 'Bruder', english: 'Brother' },
      { emoji: '👵', german: 'Oma', english: 'Grandma' },
      { emoji: '👴', german: 'Opa', english: 'Grandpa' },
      { emoji: '👶', german: 'Baby', english: 'Baby' },
      { emoji: '🤱', german: 'Tante', english: 'Aunt' },
      { emoji: '🧔', german: 'Onkel', english: 'Uncle' }
    ]
  },
  {
    id: 'time',
    label: 'Zeit',
    sublabel: 'Time and Seasons',
    icon: 'tim',
    emoji: '📅',
    items: [
      { emoji: '1️⃣', german: 'Montag', english: 'Monday' },
      { emoji: '2️⃣', german: 'Dienstag', english: 'Tuesday' },
      { emoji: '3️⃣', german: 'Mittwoch', english: 'Wednesday' },
      { emoji: '4️⃣', german: 'Donnerstag', english: 'Thursday' },
      { emoji: '🎉', german: 'Freitag', english: 'Friday' },
      { emoji: '😊', german: 'Samstag', english: 'Saturday' },
      { emoji: '⛪', german: 'Sonntag', english: 'Sunday' },
      { emoji: '🌱', german: 'Frühling', english: 'Spring' },
      { emoji: '☀️', german: 'Sommer', english: 'Summer' },
      { emoji: '🍂', german: 'Herbst', english: 'Autumn' },
      { emoji: '❄️', german: 'Winter', english: 'Winter' },
      { emoji: '🌅', german: 'Morgen', english: 'Morning' },
      { emoji: '🌞', german: 'Mittag', english: 'Noon' },
      { emoji: '🌆', german: 'Abend', english: 'Evening' },
      { emoji: '🌙', german: 'Nacht', english: 'Night' }
    ]
  },
  {
    id: 'positions',
    label: 'Positionen',
    sublabel: 'Positions',
    icon: 'pos',
    emoji: '📍',
    items: [
      { emoji: '⬆️', german: 'Oben', english: 'Above' },
      { emoji: '⬇️', german: 'Unten', english: 'Below' },
      { emoji: '⬅️', german: 'Links', english: 'Left' },
      { emoji: '➡️', german: 'Rechts', english: 'Right' },
      { emoji: '↔️', german: 'Neben', english: 'Next to' },
      { emoji: '🔙', german: 'Hinter', english: 'Behind' },
      { emoji: '👆', german: 'Vor', english: 'In front of' },
      { emoji: '🔝', german: 'Auf', english: 'On top of' },
      { emoji: '📦', german: 'In', english: 'Inside' },
      { emoji: '🔄', german: 'Zwischen', english: 'Between' }
    ]
  },
  {
    id: 'jobs',
    label: 'Berufe',
    sublabel: 'Professions',
    icon: 'job',
    emoji: '👷',
    items: [
      { emoji: '👮', german: 'Polizist', english: 'Police officer' },
      { emoji: '🚒', german: 'Feuerwehrmann', english: 'Firefighter' },
      { emoji: '👷', german: 'Bauarbeiter', english: 'Construction worker' },
      { emoji: '✈️', german: 'Pilot', english: 'Pilot' },
      { emoji: '🚌', german: 'Busfahrer', english: 'Bus driver' }
    ]
  },
  {
    id: 'dinos',
    label: 'Dinosaurier',
    sublabel: 'Dinosaurs',
    icon: 'din',
    emoji: '🦕',
    items: [
      { emoji: '🦖', german: 'Tyrannosaurus Rex', english: 'Biggest meat-eater!' },
      { emoji: '🦕', german: 'Brachiosaurus', english: 'Super long neck!' },
      { emoji: '🦖', german: 'Triceratops', english: 'Three horns!' },
      { emoji: '🦕', german: 'Stegosaurus', english: 'Plates on back!' },
      { emoji: '🦖', german: 'Velociraptor', english: 'Very fast!' },
      { emoji: '🦕', german: 'Diplodocus', english: 'Longest dino!' },
      { emoji: '🦖', german: 'Spinosaurus', english: 'Big fin on back!' },
      { emoji: '🦕', german: 'Ankylosaurus', english: 'Armored tank!' }
    ]
  },
  {
    id: 'plural',
    label: 'Einzahl Mehrzahl',
    sublabel: 'Singular and Plural',
    icon: 'plr',
    emoji: '📝',
    type: 'plural',
    items: [
      { emoji: '🍎', german: 'Apfel', plural: 'Äpfel', english: 'Apple' },
      { emoji: '🐶', german: 'Hund', plural: 'Hunde', english: 'Dog' },
      { emoji: '🐱', german: 'Katze', plural: 'Katzen', english: 'Cat' },
      { emoji: '🚗', german: 'Auto', plural: 'Autos', english: 'Car' },
      { emoji: '📚', german: 'Buch', plural: 'Bücher', english: 'Book' },
      { emoji: '🏠', german: 'Haus', plural: 'Häuser', english: 'House' },
      { emoji: '🌸', german: 'Blume', plural: 'Blumen', english: 'Flower' },
      { emoji: '🧒', german: 'Kind', plural: 'Kinder', english: 'Child' },
      { emoji: '🌳', german: 'Baum', plural: 'Bäume', english: 'Tree' },
      { emoji: '⚽', german: 'Ball', plural: 'Bälle', english: 'Ball' }
    ]
  },
  {
    id: 'questions',
    label: 'Fragen beim Arzt',
    sublabel: 'Doctor Questions',
    icon: 'que',
    emoji: '💬',
    items: [
      { emoji: '👤', german: 'Wie heißt du?', english: 'What is your name?' },
      { emoji: '🎂', german: 'Wie alt bist du?', english: 'How old are you?' },
      { emoji: '📍', german: 'Wo wohnst du?', english: 'Where do you live?' },
      { emoji: '❤️', german: 'Was magst du?', english: 'What do you like?' },
      { emoji: '😊', german: 'Wie geht es dir?', english: 'How are you?' },
      { emoji: '🎯', german: 'Was machst du gern?', english: 'What do you like to do?' }
    ]
  },
  {
    id: 'numbers',
    label: 'Zahlen',
    sublabel: 'Numbers 1 to 100',
    icon: 'num',
    emoji: '🔢',
    dynamic: true,
    items: []
  },
  {
    id: 'comparison',
    label: 'Vergleichen',
    sublabel: 'Bigger Smaller Equal',
    icon: 'cmp',
    emoji: '⚖️',
    type: 'comparison',
    dynamic: true,
    items: []
  },
  {
    id: 'math',
    label: 'Rechnen',
    sublabel: 'Add and Subtract',
    icon: 'mth',
    emoji: '➕',
    type: 'math',
    dynamic: true,
    items: []
  },
  {
    id: 'evenodd',
    label: 'Gerade Ungerade',
    sublabel: 'Even and Odd',
    icon: 'evo',
    emoji: '🔁',
    type: 'evenodd',
    dynamic: true,
    items: []
  },
  {
    id: 'colorfill',
    label: 'Farben Malen',
    sublabel: 'Color Fill Game',
    icon: 'clf',
    emoji: '🖌️',
    type: 'colorfill',
    items: [
      { shape: 'sun', german: 'Gelb', english: 'Yellow', hex: '#EAB308' },
      { shape: 'heart', german: 'Rot', english: 'Red', hex: '#EF4444' },
      { shape: 'leaf', german: 'Grün', english: 'Green', hex: '#22C55E' },
      { shape: 'balloon', german: 'Blau', english: 'Blue', hex: '#3B82F6' },
      { shape: 'flower', german: 'Rosa', english: 'Pink', hex: '#EC4899' },
      { shape: 'diamond', german: 'Lila', english: 'Purple', hex: '#A855F7' },
      { shape: 'circle', german: 'Orange', english: 'Orange', hex: '#F97316' },
      { shape: 'fish', german: 'Türkis', english: 'Turquoise', hex: '#06B6D4' },
      { shape: 'house', german: 'Braun', english: 'Brown', hex: '#854D0E' },
      { shape: 'star', german: 'Gold', english: 'Gold', hex: '#D97706' }
    ]
  },
  {
    id: 'gefuehle',
    label: 'Gefühle',
    sublabel: 'Feelings',
    icon: 'gef',
    emoji: '😊',
    items: [
      { emoji: '😄', german: 'fröhlich', english: 'happy' },
      { emoji: '😢', german: 'traurig', english: 'sad' },
      { emoji: '😠', german: 'wütend', english: 'angry' },
      { emoji: '😴', german: 'müde', english: 'tired' },
      { emoji: '😲', german: 'überrascht', english: 'surprised' },
      { emoji: '😨', german: 'ängstlich', english: 'scared' },
      { emoji: '🤒', german: 'krank', english: 'sick' },
      { emoji: '🥰', german: 'verliebt', english: 'in love' }
    ]
  },
  {
    id: 'kleidung',
    label: 'Kleidung',
    sublabel: 'Clothes',
    icon: 'kld',
    emoji: '👕',
    items: [
      { emoji: '👕', german: 'T-Shirt', english: 'T-shirt' },
      { emoji: '👖', german: 'Hose', english: 'trousers' },
      { emoji: '👗', german: 'Kleid', english: 'dress' },
      { emoji: '🧥', german: 'Jacke', english: 'jacket' },
      { emoji: '👟', german: 'Schuhe', english: 'shoes' },
      { emoji: '🧦', german: 'Socken', english: 'socks' },
      { emoji: '🧢', german: 'Mütze', english: 'cap' },
      { emoji: '🧣', german: 'Schal', english: 'scarf' },
      { emoji: '🧤', german: 'Handschuhe', english: 'gloves' },
      { emoji: '👓', german: 'Brille', english: 'glasses' }
    ]
  },
  {
    id: 'wetter',
    label: 'Wetter',
    sublabel: 'Weather',
    icon: 'wet',
    emoji: '🌦️',
    items: [
      { emoji: '☀️', german: 'Sonne', english: 'sun' },
      { emoji: '🌧️', german: 'Regen', english: 'rain' },
      { emoji: '❄️', german: 'Schnee', english: 'snow' },
      { emoji: '☁️', german: 'Wolke', english: 'cloud' },
      { emoji: '💨', german: 'Wind', english: 'wind' },
      { emoji: '⛈️', german: 'Gewitter', english: 'thunderstorm' },
      { emoji: '🌈', german: 'Regenbogen', english: 'rainbow' },
      { emoji: '🌫️', german: 'Nebel', english: 'fog' }
    ]
  },
  {
    id: 'schulsachen',
    label: 'Schulsachen',
    sublabel: 'School things',
    icon: 'sch',
    emoji: '🎒',
    items: [
      { emoji: '✏️', german: 'Stift', english: 'pencil' },
      { emoji: '📖', german: 'Buch', english: 'book' },
      { emoji: '✂️', german: 'Schere', english: 'scissors' },
      { emoji: '📏', german: 'Lineal', english: 'ruler' },
      { emoji: '🎒', german: 'Rucksack', english: 'backpack' },
      { emoji: '📓', german: 'Heft', english: 'notebook' },
      { emoji: '🖌️', german: 'Pinsel', english: 'paintbrush' },
      { emoji: '🧽', german: 'Schwamm', english: 'sponge' }
    ]
  },
  {
    id: 'verkehr',
    label: 'Verkehr',
    sublabel: 'Transport',
    icon: 'vrk',
    emoji: '🚗',
    items: [
      { emoji: '🚗', german: 'Auto', english: 'car' },
      { emoji: '🚌', german: 'Bus', english: 'bus' },
      { emoji: '🚆', german: 'Zug', english: 'train' },
      { emoji: '🚲', german: 'Fahrrad', english: 'bicycle' },
      { emoji: '✈️', german: 'Flugzeug', english: 'airplane' },
      { emoji: '🚢', german: 'Schiff', english: 'ship' },
      { emoji: '🚓', german: 'Polizeiauto', english: 'police car' },
      { emoji: '🚒', german: 'Feuerwehr', english: 'fire engine' },
      { emoji: '🚑', german: 'Krankenwagen', english: 'ambulance' },
      { emoji: '🚁', german: 'Hubschrauber', english: 'helicopter' }
    ]
  },
  {
    id: 'verben',
    label: 'Verben',
    sublabel: 'Action words',
    icon: 'vrb',
    emoji: '🏃',
    items: [
      { emoji: '🏃', german: 'laufen', english: 'to run' },
      { emoji: '😋', german: 'essen', english: 'to eat' },
      { emoji: '😴', german: 'schlafen', english: 'to sleep' },
      { emoji: '🥤', german: 'trinken', english: 'to drink' },
      { emoji: '📖', german: 'lesen', english: 'to read' },
      { emoji: '🎨', german: 'malen', english: 'to paint' },
      { emoji: '🎤', german: 'singen', english: 'to sing' },
      { emoji: '🤸', german: 'springen', english: 'to jump' },
      { emoji: '🚶', german: 'gehen', english: 'to walk' },
      { emoji: '💃', german: 'tanzen', english: 'to dance' }
    ]
  },
  {
    id: 'artikel',
    label: 'Der Die Das',
    sublabel: 'Articles',
    icon: 'art',
    emoji: '🏷️',
    type: 'choice',
    quizOnly: true,
    items: [
      { promptEmoji: '🐶', prompt: 'Hund', question: 'der, die oder das?', german: 'der', english: 'the dog', options: ['der', 'die', 'das'] },
      { promptEmoji: '🐱', prompt: 'Katze', question: 'der, die oder das?', german: 'die', english: 'the cat', options: ['der', 'die', 'das'] },
      { promptEmoji: '🏠', prompt: 'Haus', question: 'der, die oder das?', german: 'das', english: 'the house', options: ['der', 'die', 'das'] },
      { promptEmoji: '🍎', prompt: 'Apfel', question: 'der, die oder das?', german: 'der', english: 'the apple', options: ['der', 'die', 'das'] },
      { promptEmoji: '☀️', prompt: 'Sonne', question: 'der, die oder das?', german: 'die', english: 'the sun', options: ['der', 'die', 'das'] },
      { promptEmoji: '📖', prompt: 'Buch', question: 'der, die oder das?', german: 'das', english: 'the book', options: ['der', 'die', 'das'] },
      { promptEmoji: '🚗', prompt: 'Auto', question: 'der, die oder das?', german: 'das', english: 'the car', options: ['der', 'die', 'das'] },
      { promptEmoji: '🌸', prompt: 'Blume', question: 'der, die oder das?', german: 'die', english: 'the flower', options: ['der', 'die', 'das'] },
      { promptEmoji: '🐦', prompt: 'Vogel', question: 'der, die oder das?', german: 'der', english: 'the bird', options: ['der', 'die', 'das'] },
      { promptEmoji: '🥛', prompt: 'Milch', question: 'der, die oder das?', german: 'die', english: 'the milk', options: ['der', 'die', 'das'] },
      { promptEmoji: '🌳', prompt: 'Baum', question: 'der, die oder das?', german: 'der', english: 'the tree', options: ['der', 'die', 'das'] },
      { promptEmoji: '💧', prompt: 'Wasser', question: 'der, die oder das?', german: 'das', english: 'the water', options: ['der', 'die', 'das'] }
    ]
  },
  {
    id: 'gegenteile',
    label: 'Gegenteile',
    sublabel: 'Opposites',
    icon: 'geg',
    emoji: '↔️',
    type: 'choice',
    quizOnly: true,
    items: [
      { prompt: 'groß', question: 'Was ist das Gegenteil?', german: 'klein', english: 'big → small', options: ['klein', 'schnell', 'laut', 'nass'] },
      { prompt: 'heiß', question: 'Was ist das Gegenteil?', german: 'kalt', english: 'hot → cold', options: ['kalt', 'hell', 'alt', 'voll'] },
      { prompt: 'schnell', question: 'Was ist das Gegenteil?', german: 'langsam', english: 'fast → slow', options: ['langsam', 'klein', 'dunkel', 'leer'] },
      { prompt: 'hell', question: 'Was ist das Gegenteil?', german: 'dunkel', english: 'light → dark', options: ['dunkel', 'kalt', 'groß', 'leise'] },
      { prompt: 'alt', question: 'Was ist das Gegenteil?', german: 'neu', english: 'old → new', options: ['neu', 'klein', 'nass', 'laut'] },
      { prompt: 'laut', question: 'Was ist das Gegenteil?', german: 'leise', english: 'loud → quiet', options: ['leise', 'heiß', 'hoch', 'voll'] },
      { prompt: 'nass', question: 'Was ist das Gegenteil?', german: 'trocken', english: 'wet → dry', options: ['trocken', 'klein', 'alt', 'hell'] },
      { prompt: 'voll', question: 'Was ist das Gegenteil?', german: 'leer', english: 'full → empty', options: ['leer', 'schnell', 'dunkel', 'heiß'] },
      { prompt: 'hoch', question: 'Was ist das Gegenteil?', german: 'tief', english: 'high → low', options: ['tief', 'neu', 'laut', 'klein'] },
      { prompt: 'auf', question: 'Was ist das Gegenteil?', german: 'zu', english: 'open → closed', options: ['zu', 'kalt', 'groß', 'leise'] }
    ]
  },
  {
    id: 'anlaute',
    label: 'Anlaute',
    sublabel: 'First sounds',
    icon: 'anl',
    emoji: '🔤',
    type: 'choice',
    quizOnly: true,
    items: [
      { promptEmoji: '🍎', prompt: 'Apfel', question: 'Welcher Anfangsbuchstabe?', german: 'A', options: ['A', 'B', 'M', 'O'] },
      { promptEmoji: '🐶', prompt: 'Hund', question: 'Welcher Anfangsbuchstabe?', german: 'H', options: ['H', 'D', 'N', 'S'] },
      { promptEmoji: '☀️', prompt: 'Sonne', question: 'Welcher Anfangsbuchstabe?', german: 'S', options: ['S', 'Z', 'F', 'M'] },
      { promptEmoji: '🐱', prompt: 'Katze', question: 'Welcher Anfangsbuchstabe?', german: 'K', options: ['K', 'G', 'T', 'B'] },
      { promptEmoji: '🌳', prompt: 'Baum', question: 'Welcher Anfangsbuchstabe?', german: 'B', options: ['B', 'P', 'D', 'M'] },
      { promptEmoji: '🐟', prompt: 'Fisch', question: 'Welcher Anfangsbuchstabe?', german: 'F', options: ['F', 'V', 'S', 'W'] },
      { promptEmoji: '🌙', prompt: 'Mond', question: 'Welcher Anfangsbuchstabe?', german: 'M', options: ['M', 'N', 'B', 'W'] },
      { promptEmoji: '🌹', prompt: 'Rose', question: 'Welcher Anfangsbuchstabe?', german: 'R', options: ['R', 'L', 'N', 'S'] },
      { promptEmoji: '🍌', prompt: 'Banane', question: 'Welcher Anfangsbuchstabe?', german: 'B', options: ['B', 'D', 'P', 'M'] },
      { promptEmoji: '🐭', prompt: 'Maus', question: 'Welcher Anfangsbuchstabe?', german: 'M', options: ['M', 'N', 'H', 'L'] }
    ]
  },
  {
    id: 'reime',
    label: 'Reime',
    sublabel: 'Rhymes',
    icon: 'rei',
    emoji: '🎵',
    type: 'choice',
    quizOnly: true,
    items: [
      { prompt: 'Haus', question: 'Was reimt sich?', german: 'Maus', english: 'house ~ mouse', options: ['Maus', 'Ball', 'Hund', 'Baum'] },
      { prompt: 'Tisch', question: 'Was reimt sich?', german: 'Fisch', english: 'table ~ fish', options: ['Fisch', 'Stuhl', 'Auto', 'Hand'] },
      { prompt: 'Rose', question: 'Was reimt sich?', german: 'Hose', english: 'rose ~ trousers', options: ['Hose', 'Blume', 'Katze', 'Buch'] },
      { prompt: 'Baum', question: 'Was reimt sich?', german: 'Traum', english: 'tree ~ dream', options: ['Traum', 'Wald', 'Hund', 'Stein'] },
      { prompt: 'Katze', question: 'Was reimt sich?', german: 'Tatze', english: 'cat ~ paw', options: ['Tatze', 'Maus', 'Hund', 'Vogel'] },
      { prompt: 'Hand', question: 'Was reimt sich?', german: 'Sand', english: 'hand ~ sand', options: ['Sand', 'Fuß', 'Finger', 'Arm'] },
      { prompt: 'Schnee', question: 'Was reimt sich?', german: 'See', english: 'snow ~ lake', options: ['See', 'Regen', 'Eis', 'Wind'] },
      { prompt: 'Licht', question: 'Was reimt sich?', german: 'Gesicht', english: 'light ~ face', options: ['Gesicht', 'Lampe', 'Sonne', 'Stern'] }
    ]
  },
  {
    id: 'oddoneout',
    label: 'Was passt nicht?',
    sublabel: 'Odd one out',
    icon: 'odd',
    emoji: '🧩',
    type: 'choice',
    quizOnly: true,
    items: [
      { promptEmoji: '🤔', question: 'Was passt nicht dazu?', german: 'Auto', english: 'the others are animals', options: ['Hund', 'Katze', 'Auto', 'Vogel'] },
      { promptEmoji: '🤔', question: 'Was passt nicht dazu?', german: 'Banane', english: 'the others are clothes', options: ['Hose', 'Jacke', 'Banane', 'Schuhe'] },
      { promptEmoji: '🤔', question: 'Was passt nicht dazu?', german: 'Stuhl', english: 'the others are fruit', options: ['Apfel', 'Birne', 'Stuhl', 'Banane'] },
      { promptEmoji: '🤔', question: 'Was passt nicht dazu?', german: 'Hund', english: 'the others are vehicles', options: ['Auto', 'Bus', 'Hund', 'Zug'] },
      { promptEmoji: '🤔', question: 'Was passt nicht dazu?', german: 'Sonne', english: 'the others are body parts', options: ['Hand', 'Fuß', 'Sonne', 'Arm'] },
      { promptEmoji: '🤔', question: 'Was passt nicht dazu?', german: 'Tisch', english: 'the others are food', options: ['Brot', 'Käse', 'Tisch', 'Milch'] },
      { promptEmoji: '🤔', question: 'Was passt nicht dazu?', german: 'Apfel', english: 'the others are colors', options: ['Rot', 'Blau', 'Apfel', 'Grün'] },
      { promptEmoji: '🤔', question: 'Was passt nicht dazu?', german: 'Buch', english: 'the others are animals', options: ['Pferd', 'Kuh', 'Buch', 'Schaf'] }
    ]
  },
  {
    id: 'muster',
    label: 'Muster',
    sublabel: 'Patterns',
    icon: 'mus',
    emoji: '🔵',
    type: 'choice',
    quizOnly: true,
    items: [
      { promptEmoji: '🔴 🔵 🔴 🔵 ❓', question: 'Was kommt als Nächstes?', german: '🔴', options: ['🔴', '🔵', '🟢'] },
      { promptEmoji: '⭐ 🌙 ⭐ 🌙 ❓', question: 'Was kommt als Nächstes?', german: '⭐', options: ['⭐', '🌙', '☀️'] },
      { promptEmoji: '🟥 🟦 🟨 🟥 🟦 ❓', question: 'Was kommt als Nächstes?', german: '🟨', options: ['🟥', '🟦', '🟨'] },
      { promptEmoji: '🐶 🐱 🐶 🐱 ❓', question: 'Was kommt als Nächstes?', german: '🐶', options: ['🐶', '🐱', '🐭'] },
      { promptEmoji: '1️⃣ 2️⃣ 3️⃣ ❓', question: 'Was kommt als Nächstes?', german: '4️⃣', options: ['4️⃣', '5️⃣', '2️⃣'] },
      { promptEmoji: '🔺 🔺 🔵 🔺 🔺 ❓', question: 'Was kommt als Nächstes?', german: '🔵', options: ['🔵', '🔺', '🟢'] },
      { promptEmoji: '🍎 🍌 🍎 🍌 ❓', question: 'Was kommt als Nächstes?', german: '🍎', options: ['🍎', '🍌', '🍇'] },
      { promptEmoji: '🟢 🟢 🔴 🟢 🟢 ❓', question: 'Was kommt als Nächstes?', german: '🔴', options: ['🔴', '🟢', '🟡'] }
    ]
  },
  {
    id: 'mengen',
    label: 'Mengen',
    sublabel: 'How many?',
    icon: 'men',
    emoji: '🔢',
    type: 'choice',
    quizOnly: true,
    items: [
      { promptEmoji: '🍎 🍎 🍎', question: 'Wie viele?', german: '3', options: ['2', '3', '4', '5'] },
      { promptEmoji: '⭐ ⭐', question: 'Wie viele?', german: '2', options: ['1', '2', '3', '4'] },
      { promptEmoji: '🐶 🐶 🐶 🐶', question: 'Wie viele?', german: '4', options: ['3', '4', '5', '6'] },
      { promptEmoji: '🌸 🌸 🌸 🌸 🌸', question: 'Wie viele?', german: '5', options: ['4', '5', '6', '7'] },
      { promptEmoji: '🚗', question: 'Wie viele?', german: '1', options: ['1', '2', '3'] },
      { promptEmoji: '🍌 🍌 🍌 🍌 🍌 🍌', question: 'Wie viele?', german: '6', options: ['5', '6', '7', '8'] },
      { promptEmoji: '🐱 🐱 🐱', question: 'Wie viele?', german: '3', options: ['2', '3', '4'] },
      { promptEmoji: '⚽ ⚽ ⚽ ⚽', question: 'Wie viele?', german: '4', options: ['3', '4', '5'] }
    ]
  },
  {
    id: 'guide',
    label: 'Eltern Tipps',
    sublabel: 'Parent Guide',
    icon: 'gui',
    emoji: '📋',
    type: 'guide',
    noQuiz: true,
    items: [
      {
        emoji: '💬',
        german: 'Fragen beim Arzt',
        english: 'Doctor questions',
        phrases: [
          { de: 'Wie heißt du?', en: 'What is your name?' },
          { de: 'Wie alt bist du?', en: 'How old are you?' },
          { de: 'Wo wohnst du?', en: 'Where do you live?' },
          { de: 'Was magst du?', en: 'What do you like?' },
          { de: 'Hast du ein Haustier?', en: 'Do you have a pet?' }
        ]
      },
      {
        emoji: '🏥',
        german: 'Was wird getestet?',
        english: 'What is tested?',
        content: [
          'Vision and hearing check',
          'Language and vocabulary in German',
          'Memory and concentration',
          'Fine motor - drawing a person',
          'Gross motor - balance and hopping',
          'Numbers up to 10',
          'Social and emotional readiness'
        ]
      },
      {
        emoji: '📋',
        german: '2-Tage Checkliste',
        english: 'Quick checklist',
        content: [
          'Names 8 colors in German?',
          'Counts to 10?',
          'Knows full name and age?',
          'Can hop on one leg?',
          'Draws a person with 6 body parts?',
          'Vaccination booklet ready?'
        ]
      },
      {
        emoji: '🤸',
        german: 'Grobmotorik',
        english: 'Gross motor skills',
        content: [
          'Hop on one leg 5 times (each leg)',
          'Stand on one leg for about 10 seconds',
          'Walk heel-to-toe along a line',
          'Catch and throw a ball',
          'Jump forward with both feet together'
        ]
      },
      {
        emoji: '✏️',
        german: 'Feinmotorik',
        english: 'Fine motor skills',
        content: [
          'Hold the pencil with a tripod grip (three fingers)',
          'Draw a person with at least 6 parts (head, body, arms, legs, eyes, mouth)',
          'Copy simple shapes: circle, cross, square',
          'Cut along a line with scissors',
          'Practice buttons, zips and threading beads'
        ]
      },
      {
        emoji: '👀',
        german: 'Sehen und Hören',
        english: 'Vision & hearing',
        content: [
          'A vision test checks each eye - often pointing which way an "E" or symbol faces',
          'A hearing test plays soft tones through headphones',
          'These cannot be practiced - just explain it is a game so your child is relaxed',
          'Bring glasses or hearing aids if your child uses them'
        ]
      },
      {
        emoji: '🧠',
        german: 'Merken und Nachsprechen',
        english: 'Memory & repeating',
        content: [
          'Play memory / pairs card games',
          "Kim's game: show 4-5 objects, hide one, ask what is missing",
          'Repeat-after-me: say short made-up words (e.g. "ra-fo-mi") to echo back',
          'Clap the syllables of words (Ap-fel = 2 claps)',
          'Say a short sentence and have your child repeat it'
        ]
      },
      {
        emoji: '🎧',
        german: 'Anweisungen folgen',
        english: 'Following instructions',
        content: [
          'Give 2-step instructions in German: "Leg den Stift auf das Buch"',
          'Practice prepositions: auf, unter, neben, hinter, vor, in',
          'Play "Simon sagt" (Simon says) in German',
          'Ask them to point: "Zeig mir das rote Auto"'
        ]
      },
      {
        emoji: '🎒',
        german: 'Was mitbringen',
        english: 'What to bring',
        content: [
          'Vaccination booklet (Impfpass)',
          'The yellow examination booklet (U-Heft)',
          'Glasses or hearing aids if used',
          'Any relevant medical reports',
          'A snack and water - and arrive relaxed'
        ]
      }
    ]
  }
];
