const CategoryCard = ({ category, onClick, isActive }) => {
  const { label, emoji, color } = category;

  return (
    <button
      onClick={() => onClick && onClick(label)}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 min-w-[88px] active:scale-95 ${
        isActive
          ? 'bg-primary text-white shadow-primary scale-105'
          : 'bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1'
      }`}
    >
      <span className="text-2xl md:text-3xl">{emoji}</span>
      <span className={`text-xs font-semibold text-center leading-tight ${isActive ? 'text-white' : 'text-secondary'}`}>
        {label}
      </span>
    </button>
  );
};

export const CATEGORIES = [
  { label: 'All', emoji: '🍽️', color: '#FF5A5F' },
  { label: 'Biryani', emoji: '🍛', color: '#FF8C42' },
  { label: 'Pizza', emoji: '🍕', color: '#E63946' },
  { label: 'Burgers', emoji: '🍔', color: '#F4A261' },
  { label: 'Chinese', emoji: '🥢', color: '#E76F51' },
  { label: 'South Indian', emoji: '🥘', color: '#2A9D8F' },
  { label: 'Desserts', emoji: '🍰', color: '#E9C46A' },
  { label: 'Drinks', emoji: '🧋', color: '#457B9D' },
  { label: 'Momos', emoji: '🥟', color: '#A8DADC' },
  { label: 'Salads', emoji: '🥗', color: '#81B29A' },
  { label: 'Sandwiches', emoji: '🥪', color: '#F2CC8F' },
  { label: 'Healthy', emoji: '🥑', color: '#6A994E' },
];

export default CategoryCard;
