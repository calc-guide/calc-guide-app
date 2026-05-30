// components/ChatColumn/messages/OnboardingCard.jsx

export default function OnboardingCard({ visible }) {
  if (!visible) return null;

  return (
    <div className="onboard">
      <h3>Welcome — here's how this works</h3>
      <p>
        Ask your tutor anything about calculus. They'll explain step by step,
        then give you quick exercises to try right here in the conversation.
      </p>
      <div className="ob-steps">
        <div className="ob-step">
          <div className="num">1</div>
          <b>Pick a tutor</b>
          <span>Choose a teaching style from the left, anytime.</span>
        </div>
        <div className="ob-step">
          <div className="num">2</div>
          <b>Ask &amp; show</b>
          <span>Type, speak, draw a problem in the calculator, or snap a photo.</span>
        </div>
        <div className="ob-step">
          <div className="num">3</div>
          <b>Save &amp; revisit</b>
          <span>Bookmark useful chats; find lessons in History.</span>
        </div>
      </div>
    </div>
  );
}
