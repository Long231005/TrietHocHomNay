export type Philosopher = {
  customId?: string;
  name: string;
  sub: string;
  era: string;
  rarity: number;
  image: number;
  school: string;
  country: string;
  notableWorks: string[];
  famousQuote: string;
  eraWeight?: boolean;
};

function eraRarity(era: string): number {
  // Ancient: 0 (common), Medieval: 1-2, Modern: 3, Contemporary: 4
  if (era.includes('TCN') || era.includes('SCN')) return 0;
  if (era.includes('1400') || era.includes('1500') || era.includes('1600') || era.includes('1700')) return 1;
  if (era.includes('1800') || era.includes('1900')) return 2;
  if (era.includes('19') || era.includes('20')) return 3;
  return 4;
}

export const philosophers: Philosopher[] = [
  // ========== ANCIENT GREECE (Rarity 0-1) ==========
  {
    "name": "Socrates",
    "sub": "Σωκράτης · Hy Lạp",
    "era": "470-399 TCN",
    "school": "Triết học Socratic",
    "country": "Hy Lạp",
    "rarity": 0,
    "image": 0,
    "notableWorks": ["Apology", "Phaedo", "Republic"],
    "famousQuote": "Ta chỉ biết rằng ta không biết gì."
  },
  {
    "name": "Plato",
    "sub": "Πλάτων · Hy Lạp",
    "era": "428-348 TCN",
    "school": "Triết học Platonic",
    "country": "Hy Lạp",
    "rarity": 0,
    "image": 1,
    "notableWorks": ["The Republic", "Symposium", "Phaedo"],
    "famousQuote": "Kẻ yêu triết học là người yêu cái đẹp."
  },
  {
    "name": "Aristotle",
    "sub": "Ἀριστοτέλης · Hy Lạp",
    "era": "384-322 TCN",
    "school": "Peripatetic",
    "country": "Hy Lạp",
    "rarity": 1,
    "image": 2,
    "notableWorks": ["Nicomachean Ethics", "Politics", "Metaphysics"],
    "famousQuote": "Con người là động vật có lý trí."
  },
  {
    "name": "Epicurus",
    "sub": "Ἐπίκουρος · Hy Lạp",
    "era": "341-270 TCN",
    "school": "Epicureanism",
    "country": "Hy Lạp",
    "rarity": 0,
    "image": 3,
    "notableWorks": ["Letter to Menoeceus", "Principal Doctrines"],
    "famousQuote": "Chết không liên quan đến chúng ta."
  },
  {
    "name": "Zeno of Citium",
    "sub": "Ζήνων · Hy Lạp",
    "era": "334-262 TCN",
    "school": "Stoicism",
    "country": "Hy Lạp",
    "rarity": 1,
    "image": 4,
    "notableWorks": ["Republic", "On Life According to Nature"],
    "famousQuote": "Người khôn ngoan không bao giờ thay đổi."
  },
  {
    "name": "Pythagoras",
    "sub": "Πυθαγόρας · Hy Lạp",
    "era": "570-495 TCN",
    "school": "Pythagoreanism",
    "country": "Hy Lạp",
    "rarity": 1,
    "image": 5,
    "notableWorks": [],
    "famousQuote": "Con số là nguyên tắc của mọi vật."
  },
  {
    "name": "Heraclitus",
    "sub": "Ἡράκλειτος · Hy Lạp",
    "era": "535-475 TCN",
    "school": "Ionian Philosophy",
    "country": "Hy Lạp",
    "rarity": 0,
    "image": 6,
    "notableWorks": ["On Nature"],
    "famousQuote": "Không ai bước vào cùng một dòng sông hai lần."
  },
  {
    "name": "Diogenes",
    "sub": "Διογένης · Hy Lạp",
    "era": "412-323 TCN",
    "school": "Cynicism",
    "country": "Hy Lạp",
    "rarity": 0,
    "image": 7,
    "notableWorks": [],
    "famousQuote": "Ta đang tìm một người."
  },

  // ========== ANCIENT CHINA (Rarity 0-1) ==========
  {
    "name": "Confucius",
    "sub": "孔子 · Trung Quốc",
    "era": "551-479 TCN",
    "school": "Nho giáo",
    "country": "Trung Quốc",
    "rarity": 0,
    "image": 8,
    "notableWorks": ["Analects", "The Five Classics"],
    "famousQuote": "Học nhi thân vi nhân, bất diệc nhi thân vi nhân."
  },
  {
    "name": "Laozi",
    "sub": "老子 · Trung Quốc",
    "era": "6th century TCN",
    "school": "Đạo Đức",
    "country": "Trung Quốc",
    "rarity": 0,
    "image": 9,
    "notableWorks": ["Tao Te Ching", "Zhuangzi"],
    "famousQuote": "Đạo可 Đạo, phi thường Đạo."
  },
  {
    "name": "Zhuangzi",
    "sub": "莊子 · Trung Quốc",
    "era": "369-286 TCN",
    "school": "Đạo Đức",
    "country": "Trung Quốc",
    "rarity": 1,
    "image": 10,
    "notableWorks": ["Zhuangzi", "Inner Chapters"],
    "famousQuote": "Ta mơ đã thành bướm, há chẳng bước mơ ta?"
  },
  {
    "name": "Mencius",
    "sub": "孟子 · Trung Quốc",
    "era": "372-289 TCN",
    "school": "Nho giáo",
    "country": "Trung Quốc",
    "rarity": 1,
    "image": 11,
    "notableWorks": ["Mencius"],
    "famousQuote": "Người ta có tài sản do thiên phú, nhưng có đức hạnh là do tu tập."
  },
  {
    "name": "Sun Tzu",
    "sub": "孙子 · Trung Quốc",
    "era": "544-496 TCN",
    "school": "Quân sự",
    "country": "Trung Quốc",
    "rarity": 0,
    "image": 12,
    "notableWorks": ["The Art of War"],
    "famousQuote": "Biết địch, biết ta, trăm trận trăm thắng."
  },

  // ========== INDIA (Rarity 0-1) ==========
  {
    "name": "Buddha",
    "sub": "बुद्ध · Ấn Độ",
    "era": "563-483 TCN",
    "school": "Phật giáo",
    "country": "Ấn Độ",
    "rarity": 0,
    "image": 13,
    "notableWorks": ["Four Noble Truths", "Diamond Sutra"],
    "famousQuote": "Đừng tin vào điều gì chỉ vì người khác tin."
  },
  {
    "name": "Patanjali",
    "sub": "पतंजलि · Ấn Độ",
    "era": "2nd century TCN",
    "school": "Yoga",
    "country": "Ấn Độ",
    "rarity": 1,
    "image": 14,
    "notableWorks": ["Yoga Sutras"],
    "famousQuote": "Yoga là sự dừng lại của những biến động của tâm trí."
  },
  {
    "name": "Vivekananda",
    "sub": "विवेकानन्द · Ấn Độ",
    "era": "1863-1902",
    "school": "Vedanta",
    "country": "Ấn Độ",
    "rarity": 1,
    "image": 15,
    "notableWorks": ["Raja Yoga", "Karma Yoga"],
    "famousQuote": "Dậy! Thức tỉnh! Và không ngừng cho đến khi đạt được mục tiêu."
  },

  // ========== MEDIEVAL / RENAISSANCE (Rarity 1-2) ==========
  {
    "name": "Thomas Aquinas",
    "sub": "Thomas Aquinas · Ý",
    "era": "1225-1274",
    "school": "Scholasticism",
    "country": "Ý",
    "rarity": 1,
    "image": 16,
    "notableWorks": ["Summa Theologica", "Summa contra Gentiles"],
    "famousQuote": "Đức tin đòi hỏi lý trí, nhưng lý trí không thể chứng minh đức tin."
  },
  {
    "name": "Ibn Sina",
    "sub": "ابن سينا · Ba Tư",
    "era": "980-1037",
    "school": "Islamic Philosophy",
    "country": "Ba Tư",
    "rarity": 1,
    "image": 17,
    "notableWorks": ["The Book of Healing", "The Canon of Medicine"],
    "famousQuote": "Triết học không phải là nữ hoàng, mà là người phục vụ."
  },
  {
    "name": "Ibn Rushd",
    "sub": "ابن رشد · Ả Rập",
    "era": "1126-1198",
    "school": "Islamic Aristotelianism",
    "country": "Ả Rập",
    "rarity": 1,
    "image": 18,
    "notableWorks": ["The Incoherence of the Incoherence"],
    "famousQuote": "Tôn giáo và triết học không mâu thuẫn với nhau."
  },
  {
    "name": "Montaigne",
    "sub": "Michel de Montaigne · Pháp",
    "era": "1533-1592",
    "school": "Humanism",
    "country": "Pháp",
    "rarity": 1,
    "image": 19,
    "notableWorks": ["Essays"],
    "famousQuote": "Con người là vật mong manh nhất và yếu đuối nhất trong tạo hóa."
  },
  {
    "name": "Rene Descartes",
    "sub": "René Descartes · Pháp",
    "era": "1596-1650",
    "school": "Rationalism",
    "country": "Pháp",
    "rarity": 2,
    "image": 20,
    "notableWorks": ["Meditations", "Discourse on Method"],
    "famousQuote": "Ta tư duy, vậy ta tồn tại."
  },
  {
    "name": "Niccolo Machiavelli",
    "sub": "Niccolò Machiavelli · Ý",
    "era": "1469-1527",
    "school": "Political Philosophy",
    "country": "Ý",
    "rarity": 1,
    "image": 21,
    "notableWorks": ["The Prince", "Discourses on Livy"],
    "famousQuote": "Mục đích biện minh cho phương tiện."
  },

  // ========== MODERN PHILOSOPHY (Rarity 2-3) ==========
  {
    "name": "Immanuel Kant",
    "sub": "Immanuel Kant · Đức",
    "era": "1724-1804",
    "school": "German Idealism",
    "country": "Đức",
    "rarity": 3,
    "image": 22,
    "notableWorks": ["Critique of Pure Reason", "Critique of Practical Reason"],
    "famousQuote": "Hãy hành động sao cho giá trị tối đa của ý chí tự do có thể trở thành luật phổ quát."
  },
  {
    "name": "Friedrich Nietzsche",
    "sub": "Friedrich Nietzsche · Đức",
    "era": "1844-1900",
    "school": "Existentialism",
    "country": "Đức",
    "rarity": 3,
    "image": 23,
    "notableWorks": ["Thus Spoke Zarathustra", "Beyond Good and Evil"],
    "famousQuote": "Thiên tài vượt qua luân lý."
  },
  {
    "name": "Jean-Paul Sartre",
    "sub": "Jean-Paul Sartre · Pháp",
    "era": "1905-1980",
    "school": "Existentialism",
    "country": "Pháp",
    "rarity": 3,
    "image": 24,
    "notableWorks": ["Being and Nothingness", "Nausea"],
    "famousQuote": "Con người bị kết án phải tự do."
  },
  {
    "name": "Simone de Beauvoir",
    "sub": "Simone de Beauvoir · Pháp",
    "era": "1908-1986",
    "school": "Existentialism",
    "country": "Pháp",
    "rarity": 2,
    "image": 25,
    "notableWorks": ["The Second Sex", "She Came to Stay"],
    "famousQuote": "Người ta không sinh ra là đàn bà, mà bị trở thành đàn bà."
  },
  {
    "name": "Albert Camus",
    "sub": "Albert Camus · Pháp",
    "era": "1913-1960",
    "school": "Absurdism",
    "country": "Pháp",
    "rarity": 2,
    "image": 26,
    "notableWorks": ["The Stranger", "The Myth of Sisyphus"],
    "famousQuote": "Ta phải tưởng tượng Sisyphus hạnh phúc."
  },
  {
    "name": "John Stuart Mill",
    "sub": "John Stuart Mill · Anh",
    "era": "1806-1873",
    "school": "Utilitarianism",
    "country": "Anh",
    "rarity": 2,
    "image": 27,
    "notableWorks": ["On Liberty", "Utilitarianism"],
    "famousQuote": "Một người hạnh phúc hơn một người sung sướng."
  },
  {
    "name": "Karl Marx",
    "sub": "Karl Marx · Đức",
    "era": "1818-1883",
    "school": "Marxism",
    "country": "Đức",
    "rarity": 3,
    "image": 28,
    "notableWorks": ["The Communist Manifesto", "Das Kapital"],
    "famousQuote": "Triết học chỉ giải thích thế giới, vấn đề là thay đổi nó."
  },
  {
    "name": "Soren Kierkegaard",
    "sub": "Søren Kierkegaard · Đan Mạch",
    "era": "1813-1855",
    "school": "Existentialism",
    "country": "Đan Mạch",
    "rarity": 2,
    "image": 29,
    "notableWorks": ["Either/Or", "Fear and Trembling"],
    "famousQuote": "Sự sống chỉ có thể hiểu bằng cách nhìn lại."
  },
  {
    "name": "Hegel",
    "sub": "Georg Wilhelm Friedrich Hegel · Đức",
    "era": "1770-1831",
    "school": "German Idealism",
    "country": "Đức",
    "rarity": 3,
    "image": 30,
    "notableWorks": ["Phenomenology of Spirit", "Science of Logic"],
    "famousQuote": "Lịch sử thế giới là tiến bộ của tự ý thức về tự do."
  },
  {
    "name": "Arthur Schopenhauer",
    "sub": "Arthur Schopenhauer · Đức",
    "era": "1788-1860",
    "school": "Pessimism",
    "country": "Đức",
    "rarity": 2,
    "image": 31,
    "notableWorks": ["The World as Will and Representation"],
    "famousQuote": "Với tiền, người ta có thể mua được hạnh phúc."
  },

  // ========== ANALYTIC PHILOSOPHY (Rarity 2-3) ==========
  {
    "name": "Bertrand Russell",
    "sub": "Bertrand Russell · Anh",
    "era": "1872-1970",
    "school": "Analytic Philosophy",
    "country": "Anh",
    "rarity": 3,
    "image": 32,
    "notableWorks": ["Principia Mathematica", "History of Western Philosophy"],
    "famousQuote": "Điều duy nhất tôi chắc chắn là tôi không chắc chắn về bất cứ điều gì."
  },
  {
    "name": "Ludwig Wittgenstein",
    "sub": "Ludwig Wittgenstein · Áo",
    "era": "1889-1951",
    "school": "Analytic Philosophy",
    "country": "Áo",
    "rarity": 3,
    "image": 33,
    "notableWorks": ["Tractatus Logico-Philosophicus", "Philosophical Investigations"],
    "famousQuote": "Những gì không thể nói, phải im lặng."
  },
  {
    "name": "John Rawls",
    "sub": "John Rawls · Mỹ",
    "era": "1921-2002",
    "school": "Political Philosophy",
    "country": "Mỹ",
    "rarity": 2,
    "image": 34,
    "notableWorks": ["A Theory of Justice"],
    "famousQuote": "Công lý là sự trừu tượng đầu tiên của xã hội."
  },

  // ========== CONTEMPORARY (Rarity 3-4) ==========
  {
    "name": "Martin Heidegger",
    "sub": "Martin Heidegger · Đức",
    "era": "1889-1976",
    "school": "Phenomenology",
    "country": "Đức",
    "rarity": 4,
    "image": 35,
    "notableWorks": ["Being and Time"],
    "famousQuote": "Ngôn ngữ là ngôi nhà của sự tồn tại."
  },
  {
    "name": "Michel Foucault",
    "sub": "Michel Foucault · Pháp",
    "era": "1926-1984",
    "school": "Post-structuralism",
    "country": "Pháp",
    "rarity": 4,
    "image": 36,
    "notableWorks": ["Discipline and Punish", "The History of Sexuality"],
    "famousQuote": "Quyền lực ở khắp nơi."
  },
  {
    "name": "Jacques Derrida",
    "sub": "Jacques Derrida · Pháp",
    "era": "1930-2004",
    "school": "Deconstruction",
    "country": "Pháp",
    "rarity": 4,
    "image": 37,
    "notableWorks": ["Of Grammatology"],
    "famousQuote": "Văn bản không có ý nghĩa cuối cùng."
  },
  {
    "name": "Judith Butler",
    "sub": "Judith Butler · Mỹ",
    "era": "1956-",
    "school": "Feminist Philosophy",
    "country": "Mỹ",
    "rarity": 3,
    "image": 38,
    "notableWorks": ["Gender Trouble", "Bodies That Matter"],
    "famousQuote": "Giới tính không phải là điều ta có, mà là điều ta làm."
  },
  {
    "name": "Martha Nussbaum",
    "sub": "Martha Nussbaum · Mỹ",
    "era": "1947-",
    "school": "Virtue Ethics",
    "country": "Mỹ",
    "rarity": 3,
    "image": 39,
    "notableWorks": ["The Fragility of Goodness"],
    "famousQuote": "Cảm xúc không phải là kẻ thù của lý trí."
  },

  // ========== EASTERN PHILOSOPHY (Rarity 1-2) ==========
  {
    "name": "Wang Yangming",
    "sub": "王阳明 · Trung Quốc",
    "era": "1472-1529",
    "school": "Tân Nho giáo",
    "country": "Trung Quốc",
    "rarity": 2,
    "image": 40,
    "notableWorks": ["Instructions for Living"],
    "famousQuote": "Tri thức và hành động là một."
  },
  {
    "name": "Zhu Xi",
    "sub": "朱熹 · Trung Quốc",
    "era": "1130-1200",
    "school": "Nho giáo",
    "country": "Trung Quốc",
    "rarity": 2,
    "image": 41,
    "notableWorks": ["Four Books"],
    "famousQuote": "Nghiên cứu rộng rãi, hỏi kỹ, suy nghĩ cẩn thận."
  },
  {
    "name": "Dogen",
    "sub": "道元 · Nhật Bản",
    "era": "1200-1253",
    "school": "Thiền tông",
    "country": "Nhật Bản",
    "rarity": 2,
    "image": 42,
    "notableWorks": ["Shobogenzo"],
    "famousQuote": "Thiền là nghiên cứu chính bản thân ta."
  },
  {
    "name": "Seneca",
    "sub": "Seneca · La Mã",
    "era": "4 TCN - 65",
    "school": "Stoicism",
    "country": "La Mã",
    "rarity": 1,
    "image": 43,
    "notableWorks": ["Letters from a Stoic", "On the Shortness of Life"],
    "famousQuote": "Chúng ta không sợ điều gì vì chúng ta không biết sợ điều gì."
  },
  {
    "name": "Marcus Aurelius",
    "sub": "Marcus Aurelius · La Mã",
    "era": "121-180",
    "school": "Stoicism",
    "country": "La Mã",
    "rarity": 1,
    "image": 44,
    "notableWorks": ["Meditations"],
    "famousQuote": "Người ta bị cản trở từ bên ngoài bởi những thứ phi lý."
  },
  {
    "name": "Thich Nhat Hanh",
    "sub": "Thích Nhất Hạnh · Việt Nam",
    "era": "1926-2022",
    "school": "Phật giáo",
    "country": "Việt Nam",
    "rarity": 2,
    "image": 45,
    "notableWorks": ["The Miracle of Mindfulness", "Peace Is Every Step"],
    "famousQuote": "Nếu bạn thực sự yêu thương, bạn sẽ không gây ra đau khổ."
  },
  {
    "name": "Alan Watts",
    "sub": "Alan Watts · Anh/Mỹ",
    "era": "1915-1973",
    "school": "Zen",
    "country": "Anh/Mỹ",
    "rarity": 2,
    "image": 46,
    "notableWorks": ["The Way of Zen", "The Book"],
    "famousQuote": "Nếu bạn biết bạn là ai, bạn sẽ không sợ chết."
  },
  {
    "name": "Chuang Tzu",
    "sub": "莊子 · Trung Quốc",
    "era": "369-286 TCN",
    "school": "Đạo Đức",
    "country": "Trung Quốc",
    "rarity": 1,
    "image": 47,
    "notableWorks": ["Zhuangzi"],
    "famousQuote": "Cuộc sống có giới hạn, nhưng kiến thức thì vô hạn."
  },

  // ========== ETHICS & POLITICAL (Rarity 2-3) ==========
  {
    "name": "Peter Singer",
    "sub": "Peter Singer · Úc",
    "era": "1946-",
    "school": "Utilitarianism",
    "country": "Úc",
    "rarity": 3,
    "image": 48,
    "notableWorks": ["Animal Liberation", "Practical Ethics"],
    "famousQuote": "Nếu chúng ta có thể giúp đỡ mà không tổn hại gì, chúng ta nên làm."
  },
  {
    "name": "Robert Nozick",
    "sub": "Robert Nozick · Mỹ",
    "era": "1938-2002",
    "school": "Libertarianism",
    "country": "Mỹ",
    "rarity": 2,
    "image": 49,
    "notableWorks": ["Anarchy, State, and Utopia"],
    "famousQuote": "Người có quyền tối đa với tài sản của mình."
  },
  {
    "name": "Rousseau",
    "sub": "Jean-Jacques Rousseau · Thụy Sĩ",
    "era": "1712-1778",
    "school": "Social Contract",
    "country": "Thụy Sĩ",
    "rarity": 2,
    "image": 50,
    "notableWorks": ["The Social Contract", "Emile"],
    "famousQuote": "Con người sinh ra tự do, và ở khắp nơi bị xiềng xích."
  },

  // ========== MORE MODERN (Rarity 3-4) ==========
  {
    "name": "Simone Weil",
    "sub": "Simone Weil · Pháp",
    "era": "1909-1943",
    "school": "Mysticism",
    "country": "Pháp",
    "rarity": 3,
    "image": 51,
    "notableWorks": ["Waiting for God", "The Need for Roots"],
    "famousQuote": "Chú ý là hình thức tối cao của công bằng."
  },
  {
    "name": "Emmy Noether",
    "sub": "Emmy Noether · Đức",
    "era": "1882-1935",
    "school": "Abstract Algebra",
    "country": "Đức",
    "rarity": 3,
    "image": 52,
    "notableWorks": ["Noether's Theorem"],
    "famousQuote": "Các phương trình của vật lý không phải là sự thật, mà là đối xứng."
  },
  {
    "name": "W.E.B. Du Bois",
    "sub": "W.E.B. Du Bois · Mỹ",
    "era": "1868-1963",
    "school": "African American Philosophy",
    "country": "Mỹ",
    "rarity": 3,
    "image": 53,
    "notableWorks": ["The Souls of Black Folk"],
    "famousQuote": "Vấn đề của thế kỷ là vấn đề của màu da."
  },
  {
    "name": "Hypatia",
    "sub": "Hypatia · Ai Cập",
    "era": "350-415",
    "school": "Neoplatonism",
    "country": "Ai Cập",
    "rarity": 2,
    "image": 54,
    "notableWorks": ["Commentary on Ptolemy's Almagest"],
    "famousQuote": "Hãy dạy cho họ cách suy nghĩ, không phải điều gì để nghĩ."
  },
  {
    "name": "Avicenna",
    "sub": "ابن سينا · Ba Tư",
    "era": "980-1037",
    "school": "Islamic Medicine",
    "country": "Ba Tư",
    "rarity": 2,
    "image": 55,
    "notableWorks": ["The Book of Healing"],
    "famousQuote": "Sức khỏe là sự vắng mặt của bệnh tật."
  },
  {
    "name": "Boethius",
    "sub": "Anicius Boethius · La Mã",
    "era": "477-525",
    "school": "Medieval Philosophy",
    "country": "La Mã",
    "rarity": 1,
    "image": 56,
    "notableWorks": ["The Consolation of Philosophy"],
    "famousQuote": "Nếu Chúa tồn tại, làm sao có điều ác?"
  },
  {
    "name": "Mencius",
    "sub": "孟子 · Trung Quốc",
    "era": "372-289 TCN",
    "school": "Nho giáo",
    "country": "Trung Quốc",
    "rarity": 1,
    "image": 57,
    "notableWorks": ["Mencius"],
    "famousQuote": "Con người vốn dĩ tốt."
  },
  {
    "name": "Mozi",
    "sub": "墨子 · Trung Quốc",
    "era": "470-391 TCN",
    "school": "Mohism",
    "country": "Trung Quốc",
    "rarity": 1,
    "image": 58,
    "notableWorks": ["Mozi"],
    "famousQuote": "Yêu tất cả mọi người như yêu chính mình."
  },
  {
    "name": "Hans Georg Gadamer",
    "sub": "Hans-Georg Gadamer · Đức",
    "era": "1900-2002",
    "school": "Hermeneutics",
    "country": "Đức",
    "rarity": 3,
    "image": 59,
    "notableWorks": ["Truth and Method"],
    "famousQuote": "Hiểu luôn là hiểu khác đi."
  },
  {
    "name": "Philosopher Stone",
    "sub": "Bí ẩn · Trung Đại",
    "era": "8th-17th century",
    "school": "Alchemy",
    "country": "Nhiều nước",
    "rarity": 4,
    "image": 60,
    "notableWorks": [],
    "famousQuote": "Như trên, như dưới."
  }
];
