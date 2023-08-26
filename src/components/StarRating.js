import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import PropTypes from 'prop-types';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starsContainer = {
  display: 'flex',
};

StarRating.propTypes = {
  maxRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  //   onSetRating: PropTypes.func,
};

function StarRating({
  maxRating = 5,
  color = '#fcc419',
  size = 48,
  className = '',
  messages = [],
  defaultRating = 0,
  // setter function to get the value of rating state in a parent component
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const handleRating = (rating) => {
    setRating(rating);
    onSetRating(rating);
  };

  const textStyle = {
    lineHeight: '1',
    margin: '0',
    color,
    fontSize: `${size / 1.5}px`,
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={starsContainer}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onClick={() => handleRating(i + 1)}
            onMouseEnter={() => setTempRating(i + 1)}
            onMouseLeave={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ''}
      </p>
    </div>
  );
}

function Star({ full, onClick, onMouseEnter, onMouseLeave, color, size }) {
  const starStyle = {
    display: 'block',
    cursor: 'pointer',
    color,
    fontSize: `${size}px`,
  };

  return (
    <span
      role="button"
      style={starStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {full ? <AiFillStar /> : <AiOutlineStar />}
    </span>
  );
}

export default StarRating;
