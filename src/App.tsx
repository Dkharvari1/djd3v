import "./App.css";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import emailjs from "@emailjs/browser";

import {
  FaArrowRight,
  FaCalendarCheck,
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
  FaShareAlt,
  FaSoundcloud,
  FaTiktok,
} from "react-icons/fa";
import { SiVenmo } from "react-icons/si";

const socialLinks = [
  {
    name: "Instagram",
    username: "@dj_d3v",
    icon: <FaInstagram />,
    url: "https://www.instagram.com/dj_d3v/",
    className: "instagram",
  },
  {
    name: "TikTok",
    username: "@dkharvari",
    icon: <FaTiktok />,
    url: "https://www.tiktok.com/@dkharvari",
    className: "tiktok",
  },
  {
    name: "SoundCloud",
    username: "DJ D3V",
    icon: <FaSoundcloud />,
    url: "https://soundcloud.com/dj_dev",
    className: "soundcloud",
  },
];

const paymentLinks = [
  {
    name: "Venmo",
    icon: <SiVenmo />,
    url: "https://www.venmo.com/u/Dkharvari1",
    className: "venmo",
  },
];

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  startTime: string;
  endTime: string;
  guestCount: string;
  details: string;
};

const initialBookingForm: BookingForm = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  eventDate: "",
  location: "",
  startTime: "",
  endTime: "",
  guestCount: "",
  details: "",
};


type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialContactForm: ContactForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>(initialBookingForm);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>(initialContactForm);
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    document.body.style.overflow = bookingOpen || contactOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [bookingOpen, contactOpen]);

  const closeBooking = () => {
    setBookingOpen(false);
    setBookingStatus("idle");
  };

  const updateBookingField = (field: keyof BookingForm, value: string) => {
    setBookingForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (bookingStatus !== "idle") {
      setBookingStatus("idle");
    }
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("Missing EmailJS environment variables.");
      setBookingStatus("error");
      return;
    }

    setBookingStatus("sending");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: bookingForm.name,
          from_email: bookingForm.email,
          phone: bookingForm.phone,
          event_type: bookingForm.eventType,
          event_date: bookingForm.eventDate,
          event_location: bookingForm.location,
          start_time: bookingForm.startTime,
          end_time: bookingForm.endTime || "Not provided",
          guest_count: bookingForm.guestCount || "Not provided",
          message: bookingForm.details || "No additional details provided.",
        },
        {
          publicKey,
        }
      );

      setBookingStatus("success");
      setBookingForm(initialBookingForm);
    } catch (error) {
      console.error("Booking request failed:", error);
      setBookingStatus("error");
    }
  };


  const closeContact = () => {
    setContactOpen(false);
    setContactStatus("idle");
  };

  const updateContactField = (field: keyof ContactForm, value: string) => {
    setContactForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (contactStatus !== "idle") {
      setContactStatus("idle");
    }
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("Missing EmailJS contact environment variables.");
      setContactStatus("error");
      return;
    }

    setContactStatus("sending");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: contactForm.name,
          from_email: contactForm.email,
          phone: contactForm.phone || "Not provided",
          inquiry_subject: contactForm.subject,
          message: contactForm.message,
        },
        {
          publicKey,
        }
      );

      setContactStatus("success");
      setContactForm(initialContactForm);
    } catch (error) {
      console.error("Contact inquiry failed:", error);
      setContactStatus("error");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "DJ D3V",
      text: "DJ D3V — Chicago DJ",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // Ignore cancelled share actions.
    }
  };

  return (
    <main className="page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <article className="profile-card">
        <header className="cover">
          <img src="/cover.jpg" alt="DJ D3V cover" />
          <div className="cover-overlay" />

          <button
            className="share-button"
            type="button"
            onClick={handleShare}
            aria-label="Share DJ D3V profile"
          >
            <FaShareAlt />
          </button>

          <div className="cover-brand"></div>
        </header>

        <section className="profile-section">
          <div className="profile-top-row">
            <div className="profile-picture-wrap">
              <div className="profile-picture">
                <img src="./profile.png" alt="DJ D3V profile" />
              </div>
              {/* <span className="status-dot" aria-label="Available for bookings" /> */}
            </div>

            <span className="availability-pill">Available for bookings</span>
          </div>

          <div className="profile-info">
            <div className="location-line">
              <FaMapMarkerAlt />
              <span>Chicago</span>
            </div>

            <p className="bio">
              <strong>Book me for your next event!</strong>
            </p>

            <div className="genre-tags" aria-label="DJ genres">
              <span>Bollywood</span>
              <span>Punjabi</span>
              <span>Hip-Hop</span>
              <span>House</span>
              <span>EDM</span>
              <span>+ More</span>
            </div>

            <div className="main-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setBookingStatus("idle");
                  setBookingOpen(true);
                }}
              >
                <FaCalendarCheck />
                <span>Book Me</span>
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setContactStatus("idle");
                  setContactOpen(true);
                }}
              >
                <FaEnvelope />
                <span>Contact</span>
              </button>
            </div>
          </div>
        </section>

        <section className="content-section links-section">
          <div className="section-heading">
            <div>
              <p className="section-label">CONNECT</p>
              <h2>Follow DJ D3V</h2>
            </div>
            <span className="section-count">03</span>
          </div>

          <div className="link-list">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div className="link-left">
                  <div className={`link-icon ${link.className}`}>{link.icon}</div>

                  <div className="link-copy">
                    <strong>{link.name}</strong>
                    <span>{link.username}</span>
                  </div>
                </div>

                <div className="link-arrow" aria-hidden="true">
                  <FaArrowRight />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="content-section payment-section">
          <div className="section-heading">
            <div>
              <p className="section-label">PAYMENTS</p>
              <h2>Pay DJ D3V</h2>
            </div>
          </div>

          <div className="payment-grid" style={{ gridTemplateColumns: "1fr" }}>
            {paymentLinks.map((payment) => (
              <a
                key={payment.name}
                href={payment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="payment-button"
              >
                <span className={`payment-icon ${payment.className}`}>
                  {payment.icon}
                </span>
                <span>{payment.name}</span>
              </a>
            ))}
          </div>

          <div className="zelle-card">
            <div className="zelle-mark">Z</div>
            <div className="zelle-copy">
              <span>Zelle</span>
              <small>(847) 532-0317</small>
              <small>devkharvari@gmail.com</small>
            </div>
            <span className="manual-badge">Manual</span>
          </div>
        </section>


        <footer>
          <div className="footer-logo">DJ D3V</div>
          <p>Chicago • Open Format DJ</p>
          <span>© 2026 DJ D3V</span>
        </footer>
      </article>

      {bookingOpen &&
        createPortal(
          (
            <div
              className="booking-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeBooking();
                }
              }}
            >
              <section
                className="booking-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-title"
              >
                <div className="booking-modal-header">
                  <div>
                    <p className="section-label">BOOKING REQUEST</p>
                    <h2 id="booking-title">Book DJ D3V</h2>
                    <p>Tell me a little about your event.</p>
                  </div>

                  <button
                    type="button"
                    className="booking-close"
                    onClick={closeBooking}
                    aria-label="Close booking form"
                  >
                    ×
                  </button>
                </div>

                {bookingStatus === "success" ? (
                  <div className="booking-success" role="status">
                    <div className="booking-success-icon">✓</div>
                    <h3>Request sent!</h3>
                    <p>
                      Thanks for reaching out. I received your event details and will get
                      back to you as soon as possible.
                    </p>
                    <button type="button" className="booking-done-btn" onClick={closeBooking}>
                      Done
                    </button>
                  </div>
                ) : (
                  <form className="booking-form" onSubmit={submitBooking}>
                    <div className="booking-field">
                      <label htmlFor="booking-name">Name</label>
                      <input
                        id="booking-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        value={bookingForm.name}
                        onChange={(event) => updateBookingField("name", event.target.value)}
                        required
                      />
                    </div>

                    <div className="booking-two-column">
                      <div className="booking-field">
                        <label htmlFor="booking-phone">Phone</label>
                        <input
                          id="booking-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="(555) 555-5555"
                          value={bookingForm.phone}
                          onChange={(event) => updateBookingField("phone", event.target.value)}
                          required
                        />
                      </div>

                      <div className="booking-field">
                        <label htmlFor="booking-email">Email</label>
                        <input
                          id="booking-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@email.com"
                          value={bookingForm.email}
                          onChange={(event) => updateBookingField("email", event.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="booking-two-column">
                      <div className="booking-field">
                        <label htmlFor="booking-type">Event type</label>
                        <select
                          id="booking-type"
                          value={bookingForm.eventType}
                          onChange={(event) => updateBookingField("eventType", event.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Select event
                          </option>
                          <option>Wedding</option>
                          <option>Reception</option>
                          <option>Engagement</option>
                          <option>Birthday</option>
                          <option>Private Party</option>
                          <option>Corporate Event</option>
                          <option>Club / Bar</option>
                          <option>School / College Event</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="booking-field">
                        <label htmlFor="booking-date">Event date</label>
                        <input
                          id="booking-date"
                          type="date"
                          value={bookingForm.eventDate}
                          onChange={(event) => updateBookingField("eventDate", event.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="booking-field">
                      <label htmlFor="booking-location">Event location</label>
                      <input
                        id="booking-location"
                        type="text"
                        placeholder="Venue, city, or address"
                        value={bookingForm.location}
                        onChange={(event) => updateBookingField("location", event.target.value)}
                        required
                      />
                    </div>

                    <div className="booking-three-column">
                      <div className="booking-field">
                        <label htmlFor="booking-start">Start time</label>
                        <input
                          id="booking-start"
                          type="time"
                          value={bookingForm.startTime}
                          onChange={(event) => updateBookingField("startTime", event.target.value)}
                          required
                        />
                      </div>

                      <div className="booking-field">
                        <label htmlFor="booking-end">End time</label>
                        <input
                          id="booking-end"
                          type="time"
                          value={bookingForm.endTime}
                          onChange={(event) => updateBookingField("endTime", event.target.value)}
                        />
                      </div>

                      <div className="booking-field">
                        <label htmlFor="booking-guests">Guests</label>
                        <input
                          id="booking-guests"
                          type="number"
                          min="1"
                          inputMode="numeric"
                          placeholder="150"
                          value={bookingForm.guestCount}
                          onChange={(event) => updateBookingField("guestCount", event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="booking-field">
                      <label htmlFor="booking-details">Additional details</label>
                      <textarea
                        id="booking-details"
                        rows={4}
                        placeholder="Music preferences, event schedule, special requests, etc."
                        value={bookingForm.details}
                        onChange={(event) => updateBookingField("details", event.target.value)}
                      />
                    </div>

                    {bookingStatus === "error" && (
                      <p className="booking-error" role="alert">
                        I couldn't send your request. Please try again or use the Contact button.
                      </p>
                    )}

                    <button
                      className="booking-submit"
                      type="submit"
                      disabled={bookingStatus === "sending"}
                    >
                      {bookingStatus === "sending" ? "Sending..." : "Send Booking Request"}
                    </button>

                    <p className="booking-note">
                      Submitting this form sends your event details directly to DJ D3V.
                    </p>
                  </form>
                )}
              </section>
            </div>
          ),
          document.body
        )}

      {contactOpen &&
        createPortal(
          (
            <div
              className="booking-backdrop contact-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeContact();
                }
              }}
            >
              <section
                className="booking-modal contact-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-title"
              >
                <div className="booking-modal-header">
                  <div>
                    <p className="section-label">GENERAL INQUIRY</p>
                    <h2 id="contact-title">Contact DJ D3V</h2>
                    <p>Questions, collaborations, or anything else? Send me a message.</p>
                  </div>

                  <button
                    type="button"
                    className="booking-close"
                    onClick={closeContact}
                    aria-label="Close contact form"
                  >
                    ×
                  </button>
                </div>

                {contactStatus === "success" ? (
                  <div className="booking-success" role="status">
                    <div className="booking-success-icon">✓</div>
                    <h3>Message sent!</h3>
                    <p>
                      Thanks for reaching out. Your inquiry was sent successfully and
                      I’ll get back to you as soon as possible.
                    </p>
                    <button
                      type="button"
                      className="booking-done-btn"
                      onClick={closeContact}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form className="booking-form contact-form" onSubmit={submitContact}>
                    <div className="booking-field">
                      <label htmlFor="contact-name">Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={(event) =>
                          updateContactField("name", event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="booking-two-column">
                      <div className="booking-field">
                        <label htmlFor="contact-email">Email</label>
                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@email.com"
                          value={contactForm.email}
                          onChange={(event) =>
                            updateContactField("email", event.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="booking-field">
                        <label htmlFor="contact-phone">Phone <span className="optional-label">Optional</span></label>
                        <input
                          id="contact-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="(555) 555-5555"
                          value={contactForm.phone}
                          onChange={(event) =>
                            updateContactField("phone", event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="booking-field">
                      <label htmlFor="contact-subject">What is this about?</label>
                      <select
                        id="contact-subject"
                        value={contactForm.subject}
                        onChange={(event) =>
                          updateContactField("subject", event.target.value)
                        }
                        required
                      >
                        <option value="" disabled>
                          Select a topic
                        </option>
                        <option>General Inquiry</option>
                        <option>Collaboration</option>
                        <option>DJ / Music Question</option>
                        <option>Business Opportunity</option>
                        <option>Existing Booking</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="booking-field">
                      <label htmlFor="contact-message">Message</label>
                      <textarea
                        id="contact-message"
                        rows={6}
                        placeholder="How can I help?"
                        value={contactForm.message}
                        onChange={(event) =>
                          updateContactField("message", event.target.value)
                        }
                        required
                      />
                    </div>

                    {contactStatus === "error" && (
                      <p className="booking-error" role="alert">
                        I couldn't send your message. Please try again.
                      </p>
                    )}

                    <button
                      className="booking-submit"
                      type="submit"
                      disabled={contactStatus === "sending"}
                    >
                      {contactStatus === "sending" ? "Sending..." : "Send Message"}
                    </button>

                    <p className="booking-note">
                      Your inquiry will be sent directly to DJ D3V.
                    </p>
                  </form>
                )}
              </section>
            </div>
          ),
          document.body
        )}
    </main>
  );
}

export default App;