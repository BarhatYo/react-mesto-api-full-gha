export default function InfoTooltip({ name, isOpen, tooltipContent, onClose }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="info-tooltip popup__container">
        <button
          onClick={onClose}
          className="popup__close"
          type="button"
          aria-label="Закрыть окно"
        ></button>
        <img
          src={tooltipContent.image}
          className="info-tooltip__image"
          alt={tooltipContent.name}
        />
        <h2 className="info-tooltip__title">{tooltipContent.text}</h2>
      </div>
    </div>
  );
}
