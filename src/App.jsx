import { useState, useEffect, useRef, useCallback } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-creator-core/survey-creator-core.min.css";
import "survey-core/defaultV2.min.css";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const CORRECT_PASSWORD = "780WestCalgaryMa!!";

// ─── ALL SBC FORMS ────────────────────────────────────────────────────────────
const SBC_FORMS = [
  // ── CLIENT / EVENT FORMS ──
  {
    key: "inperson_agreement",
    label: "In-Person Agreement & Payment Info",
    group: "Client / Event Forms",
    schema: {
      title: "In Person Appearance: Agreement & Payment Information",
      pages: [
        {
          name: "page1",
          title: "Host Main Contact Information",
          elements: [
            { type: "panel", name: "host_contact", title: "Primary representative from Host Organization to coordinate next steps.", elements: [
              { type: "text", name: "host_first_name", title: "First Name", isRequired: true },
              { type: "text", name: "host_last_name", title: "Last Name", isRequired: true },
              { type: "text", name: "host_title", title: "Title" },
              { type: "text", name: "host_email", title: "Email", inputType: "email", isRequired: true },
            ]},
            { type: "panel", name: "deadlines", title: "Upcoming Deadlines", elements: [
              { type: "text", name: "announce_deadline", title: "Announce speaker to attendees deadline", inputType: "date" },
              { type: "radiogroup", name: "promo_materials_received", title: "Have you received the promotional materials?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
              { type: "radiogroup", name: "confirmed_with_speaker", title: "Are you confirmed with the speaker?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
              { type: "radiogroup", name: "bilingual_requirement", title: "Is there any bilingual requirement?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
              { type: "radiogroup", name: "slide_deck_required", title: "Do you require the speaker's slide deck before the session?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
            ]},
          ],
        },
        {
          name: "page2",
          title: "Event & Venue Details",
          elements: [
            { type: "text", name: "event_name", title: "Event Name", isRequired: true },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date", isRequired: true },
            { type: "text", name: "venue_name", title: "Venue Name", isRequired: true },
            { type: "text", name: "venue_address", title: "Venue Address" },
            { type: "text", name: "event_city", title: "City" },
            { type: "text", name: "event_province", title: "Province / State" },
            { type: "text", name: "event_country", title: "Country" },
            { type: "text", name: "session_start_time", title: "Session Start Time", inputType: "time" },
            { type: "text", name: "session_end_time", title: "Session End Time", inputType: "time" },
            { type: "text", name: "expected_attendees", title: "Expected Number of Attendees" },
          ],
        },
        {
          name: "page3",
          title: "Payment Information",
          elements: [
            { type: "text", name: "organization_legal_name", title: "Organization Legal Name", isRequired: true },
            { type: "text", name: "billing_address", title: "Billing Address", isRequired: true },
            { type: "text", name: "billing_city", title: "City", isRequired: true },
            { type: "text", name: "billing_province", title: "Province / State" },
            { type: "text", name: "billing_postal", title: "Postal / Zip Code" },
            { type: "text", name: "billing_country", title: "Country" },
            { type: "dropdown", name: "payment_method", title: "Preferred Payment Method", choices: ["EFT / Wire Transfer", "Cheque", "Credit Card", "Other"] },
            { type: "text", name: "po_number", title: "PO Number (if applicable)" },
            { type: "comment", name: "payment_notes", title: "Payment Notes" },
          ],
        },
      ],
    },
  },
  {
    key: "virtual_agreement",
    label: "Virtual Appearance Agreement",
    group: "Client / Event Forms",
    schema: {
      title: "Virtual Appearance Agreement",
      pages: [
        {
          name: "page1",
          title: "Host Main Contact Information",
          elements: [
            { type: "text", name: "host_first_name", title: "First Name", isRequired: true },
            { type: "text", name: "host_last_name", title: "Last Name", isRequired: true },
            { type: "text", name: "host_title", title: "Title" },
            { type: "text", name: "host_phone", title: "Phone", isRequired: true },
            { type: "text", name: "host_email", title: "Email", inputType: "email", isRequired: true },
          ],
        },
        {
          name: "page2",
          title: "Upcoming Deadlines",
          elements: [
            { type: "text", name: "announce_deadline", title: "Announce speaker to attendees deadline", inputType: "date" },
            { type: "radiogroup", name: "promo_materials_received", title: "Have you received the promotional materials?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
            { type: "radiogroup", name: "confirmed_with_speaker", title: "Are you connected with the speaker?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
            { type: "radiogroup", name: "bilingual_requirement", title: "Is there any bilingual requirement?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
            { type: "comment", name: "bilingual_description", title: "Please describe bilingual requirements", isRequired: true },
            { type: "radiogroup", name: "slide_deck_required", title: "Do you require the speaker's slide deck before the session?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
            { type: "text", name: "slide_deck_deadline", title: "Slide deck received from speaker deadline", inputType: "date" },
            { type: "comment", name: "slide_deck_use", title: "Explain the intended use of the slide deck" },
          ],
        },
        {
          name: "page3",
          title: "Virtual Platform Details",
          elements: [
            { type: "dropdown", name: "platform", title: "Virtual Platform", choices: ["Zoom", "Microsoft Teams", "Google Meet", "Webex", "Hopin", "StreamYard", "Other"] },
            { type: "text", name: "meeting_link", title: "Meeting Link / URL", isRequired: true },
            { type: "text", name: "meeting_id", title: "Meeting ID" },
            { type: "text", name: "meeting_password", title: "Meeting Password" },
            { type: "text", name: "session_date", title: "Session Date", inputType: "date", isRequired: true },
            { type: "text", name: "session_start_time", title: "Session Start Time", inputType: "time", isRequired: true },
            { type: "dropdown", name: "time_zone", title: "Time Zone", choices: ["ET (Eastern)", "CT (Central)", "MT (Mountain)", "PT (Pacific)", "AT (Atlantic)", "Other"] },
            { type: "comment", name: "platform_instructions", title: "Platform / Technical Instructions for Speaker" },
          ],
        },
        {
          name: "page4",
          title: "Payment Information",
          elements: [
            { type: "text", name: "organization_legal_name", title: "Organization Legal Name", isRequired: true },
            { type: "text", name: "billing_address", title: "Billing Address", isRequired: true },
            { type: "dropdown", name: "payment_method", title: "Preferred Payment Method", choices: ["EFT / Wire Transfer", "Cheque", "Credit Card", "Other"] },
            { type: "text", name: "po_number", title: "PO Number (if applicable)" },
          ],
        },
      ],
    },
  },
  {
    key: "virtual_itinerary",
    label: "Virtual Itinerary",
    group: "Client / Event Forms",
    schema: {
      title: "Virtual Itinerary",
      pages: [
        {
          name: "page1",
          title: "Event Information",
          elements: [
            { type: "text", name: "host_organization", title: "Host Organization Name" },
            { type: "text", name: "event_website", title: "Event Website / Landing Page" },
            { type: "text", name: "speaker_name", title: "Speaker Name" },
            { type: "text", name: "title_of_event", title: "Title of Event" },
            { type: "text", name: "theme_of_event", title: "Theme of Event" },
            { type: "text", name: "event_city", title: "Event City" },
            { type: "text", name: "event_province", title: "Event Province / State" },
            { type: "text", name: "event_country", title: "Event Country" },
            { type: "radiogroup", name: "date_status", title: "Event Date(s)", isRequired: true, choices: ["Confirmed Date", "Multiple Days / Events", "Date To Be Confirmed"] },
            { type: "text", name: "event_date_1", title: "Event Date 1", inputType: "date" },
            { type: "comment", name: "event_date_notes", title: "Date Notes" },
          ],
        },
        {
          name: "page2",
          title: "Virtual Platform & Session Details",
          elements: [
            { type: "dropdown", name: "platform", title: "Virtual Platform", choices: ["Zoom", "Microsoft Teams", "Google Meet", "Webex", "Hopin", "StreamYard", "Other"] },
            { type: "text", name: "meeting_link", title: "Meeting Link / URL", isRequired: true },
            { type: "text", name: "meeting_id", title: "Meeting ID" },
            { type: "text", name: "meeting_password", title: "Meeting Password" },
            { type: "text", name: "session_start_time", title: "Session Start Time", inputType: "time" },
            { type: "dropdown", name: "time_zone", title: "Time Zone", choices: ["ET (Eastern)", "CT (Central)", "MT (Mountain)", "PT (Pacific)", "AT (Atlantic)", "Other"] },
            { type: "text", name: "speaker_arrival_time", title: "Speaker Virtual Arrival Time (green room)", inputType: "time" },
            { type: "comment", name: "technical_instructions", title: "Technical Instructions for Speaker" },
            { type: "comment", name: "additional_notes", title: "Additional Notes" },
          ],
        },
      ],
    },
  },
  {
    key: "inperson_itinerary",
    label: "In-Person Itinerary",
    group: "Client / Event Forms",
    schema: {
      title: "Speaker Itinerary — In-Person Event",
      pages: [
        {
          name: "page1",
          title: "Event Information",
          elements: [
            { type: "text", name: "host_organization", title: "Host Organization Name" },
            { type: "text", name: "event_website", title: "Event Website / Landing Page" },
            { type: "text", name: "speaker_name", title: "Speaker Name" },
            { type: "text", name: "title_of_event", title: "Title of Event" },
            { type: "text", name: "theme_of_event", title: "Theme of Event" },
            { type: "text", name: "venue_name", title: "Venue Name", isRequired: true },
            { type: "text", name: "venue_address", title: "Venue Address", isRequired: true },
            { type: "text", name: "event_city", title: "Event City" },
            { type: "text", name: "event_province", title: "Event Province / State" },
            { type: "text", name: "event_country", title: "Event Country" },
            { type: "radiogroup", name: "date_status", title: "Event Date(s)", isRequired: true, choices: ["Confirmed Date", "Multiple Days / Events", "Date To Be Confirmed"] },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date" },
          ],
        },
        {
          name: "page2",
          title: "Schedule & Logistics",
          elements: [
            { type: "text", name: "session_start_time", title: "Session Start Time", inputType: "time" },
            { type: "text", name: "session_end_time", title: "Session End Time", inputType: "time" },
            { type: "text", name: "speaker_arrival_time", title: "Requested Speaker Arrival Time", inputType: "time" },
            { type: "comment", name: "parking_instructions", title: "Parking / Arrival Instructions" },
            { type: "comment", name: "onsite_contact", title: "On-Site Contact Name & Phone" },
            { type: "comment", name: "additional_notes", title: "Additional Notes for the Speaker" },
          ],
        },
      ],
    },
  },
  {
    key: "onsite_requirements",
    label: "On-Site Requirements",
    group: "Client / Event Forms",
    schema: {
      title: "On-Site Requirements",
      pages: [
        {
          name: "page1",
          title: "Room & Stage Setup",
          elements: [
            { type: "dropdown", name: "stage_setup", title: "Stage Setup", choices: ["Theatre", "Classroom", "Boardroom", "Banquet", "U-Shape", "Other"] },
            { type: "radiogroup", name: "raised_stage", title: "Raised stage required?", choices: ["Yes", "No", "Unsure"] },
            { type: "comment", name: "room_layout", title: "Describe the required layout" },
            { type: "text", name: "room_capacity", title: "Room Capacity" },
          ],
        },
        {
          name: "page2",
          title: "Audio / Visual",
          elements: [
            { type: "radiogroup", name: "wireless_mic", title: "Wireless microphone required?", isRequired: true, choices: ["Yes", "No", "Unsure"] },
            { type: "dropdown", name: "audience_mic", title: "Audience microphone needed?", choices: ["Yes - Handheld", "Yes - Roving", "No"] },
            { type: "dropdown", name: "screen_size", title: "Screen Size", choices: ["Small (up to 8ft)", "Medium (8-12ft)", "Large (12ft+)", "LED Wall"] },
            { type: "radiogroup", name: "speaker_brings_computer", title: "Speaker brings own computer?", choices: ["Yes", "No"] },
            { type: "radiogroup", name: "hdmi_required", title: "HDMI cord required?", choices: ["Yes", "No"] },
            { type: "radiogroup", name: "clicker_required", title: "Wireless remote clicker required?", choices: ["Yes", "No"] },
            { type: "radiogroup", name: "wifi_required", title: "WiFi access required?", choices: ["Yes", "No"] },
            { type: "comment", name: "av_notes", title: "Additional AV notes" },
          ],
        },
        {
          name: "page3",
          title: "Other Requirements",
          elements: [
            { type: "text", name: "water_requirements", title: "Water / Beverage Requirements" },
            { type: "comment", name: "audience_preparation", title: "How should the audience prepare?" },
            { type: "radiogroup", name: "recording_permission", title: "Permission to record the session?", choices: ["Yes - Full", "Yes - Audio Only", "No", "Partial"] },
            { type: "comment", name: "additional_requirements", title: "Any other on-site requirements" },
          ],
        },
      ],
    },
  },
  {
    key: "travel_agent",
    label: "Travel Agent Form",
    group: "Client / Event Forms",
    schema: {
      title: "Travel Agent Form",
      pages: [
        {
          name: "page1",
          title: "Event & Speaker Details",
          elements: [
            { type: "text", name: "speaker_name", title: "Speaker Name", isRequired: true },
            { type: "text", name: "event_name", title: "Event Name", isRequired: true },
            { type: "text", name: "host_organization", title: "Host Organization", isRequired: true },
            { type: "text", name: "event_city", title: "Event City", isRequired: true },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date", isRequired: true },
            { type: "text", name: "event_start_time", title: "Event Start Time", inputType: "time" },
          ],
        },
        {
          name: "page2",
          title: "Travel Arrangements",
          elements: [
            { type: "dropdown", name: "travel_type", title: "Travel Type", isRequired: true, choices: ["Flight", "Train", "Driving", "Virtual - No Travel"] },
            { type: "text", name: "departure_city", title: "Departure City" },
            { type: "text", name: "arrival_city", title: "Arrival City" },
            { type: "text", name: "departure_date", title: "Departure Date", inputType: "date" },
            { type: "text", name: "return_date", title: "Return Date", inputType: "date" },
            { type: "dropdown", name: "seat_class", title: "Seat Class", choices: ["Economy", "Premium Economy", "Business", "First Class"] },
            { type: "text", name: "frequent_flyer_number", title: "Frequent Flyer Number" },
            { type: "text", name: "passport_name", title: "Name on Passport / ID" },
            { type: "text", name: "date_of_birth", title: "Date of Birth", inputType: "date" },
            { type: "text", name: "passport_number", title: "Passport Number" },
            { type: "text", name: "passport_expiry", title: "Passport Expiry Date", inputType: "date" },
          ],
        },
        {
          name: "page3",
          title: "Hotel & Ground Transport",
          elements: [
            { type: "radiogroup", name: "hotel_required", title: "Hotel Required?", choices: ["Yes", "No"] },
            { type: "text", name: "check_in_date", title: "Check-In Date", inputType: "date" },
            { type: "text", name: "check_out_date", title: "Check-Out Date", inputType: "date" },
            { type: "dropdown", name: "room_preference", title: "Room Preference", choices: ["Single King", "Single Queen", "Double Queen", "Suite"] },
            { type: "dropdown", name: "ground_transport", title: "Ground Transportation", choices: ["Uber / Taxi", "Personal Escort", "Black Limo", "Car Rental", "None"] },
            { type: "comment", name: "transport_notes", title: "Transportation Notes" },
            { type: "comment", name: "special_requests", title: "Special Requests / Dietary / Accessibility Needs" },
          ],
        },
      ],
    },
  },

  // ── SPEAKER PORTAL FORMS ──
  {
    key: "speaker_travel_preferences",
    label: "Speaker Travel Preferences",
    group: "Speaker Portal Forms",
    schema: {
      title: "Speaker Travel Preferences",
      pages: [
        {
          name: "page1",
          title: "Personal Travel Details",
          elements: [
            { type: "text", name: "legal_name", title: "Legal Name (as on ID/Passport)", isRequired: true },
            { type: "text", name: "date_of_birth", title: "Date of Birth", inputType: "date" },
            { type: "text", name: "passport_number", title: "Passport Number" },
            { type: "text", name: "passport_expiry", title: "Passport Expiry Date", inputType: "date" },
            { type: "text", name: "nationality", title: "Nationality" },
            { type: "text", name: "frequent_flyer_airline", title: "Preferred Airline" },
            { type: "text", name: "frequent_flyer_number", title: "Frequent Flyer Number" },
          ],
        },
        {
          name: "page2",
          title: "Seat & Class Preferences",
          elements: [
            { type: "dropdown", name: "seat_class", title: "Preferred Seat Class", choices: ["Economy", "Premium Economy", "Business", "First Class"] },
            { type: "dropdown", name: "seat_position", title: "Preferred Seat Position", choices: ["Window", "Aisle", "No Preference"] },
            { type: "radiogroup", name: "hotel_required", title: "Hotel Required for Events?", choices: ["Yes", "No", "Depends on distance"] },
            { type: "dropdown", name: "room_preference", title: "Room Preference", choices: ["Single King", "Single Queen", "Double Queen", "Suite"] },
            { type: "comment", name: "dietary_requirements", title: "Dietary Requirements / Allergies" },
            { type: "comment", name: "accessibility_needs", title: "Accessibility Needs" },
            { type: "comment", name: "additional_travel_notes", title: "Additional Travel Notes or Preferences" },
          ],
        },
      ],
    },
  },
  {
    key: "update_biography",
    label: "Update Biography",
    group: "Speaker Portal Forms",
    schema: {
      title: "Update Biography",
      pages: [
        {
          name: "page1",
          title: "Speaker Biography",
          elements: [
            { type: "comment", name: "full_bio", title: "Full Biography", isRequired: true },
            { type: "comment", name: "short_bio", title: "Short Bio (75 words max)", isRequired: true },
            { type: "comment", name: "highlight_bio", title: "Highlight Bio (150 words max)" },
            { type: "text", name: "descriptive_title", title: "Descriptive Title / Tagline", isRequired: true },
            { type: "comment", name: "key_credentials", title: "Key Credentials / Awards / Recognitions" },
          ],
        },
        {
          name: "page2",
          title: "Languages & Delivery",
          elements: [
            { type: "checkbox", name: "languages", title: "Languages Spoken", choices: ["English", "French", "Spanish", "Mandarin", "Other"] },
            { type: "checkbox", name: "delivery_formats", title: "Delivery Formats Available", choices: ["In-Person", "Virtual", "Hybrid"] },
            { type: "comment", name: "bio_notes", title: "Additional Notes for SBC Team" },
          ],
        },
      ],
    },
  },
  {
    key: "av_tech_requirement",
    label: "AV-Tech Requirement",
    group: "Speaker Portal Forms",
    schema: {
      title: "AV & Tech Requirements",
      pages: [
        {
          name: "page1",
          title: "Stage & Room Setup",
          elements: [
            { type: "dropdown", name: "stage_setup", title: "Preferred Stage Setup", choices: ["Theatre", "Classroom", "Boardroom", "Banquet", "U-Shape", "Other"] },
            { type: "comment", name: "stage_notes", title: "Stage / Room Notes" },
          ],
        },
        {
          name: "page2",
          title: "Microphone & Audio",
          elements: [
            { type: "radiogroup", name: "wireless_mic", title: "Wireless microphone required?", isRequired: true, choices: ["Yes", "No"] },
            { type: "dropdown", name: "mic_type", title: "Preferred Microphone Type", choices: ["Lapel / Lavalier", "Handheld", "Headset", "Podium", "No Preference"] },
            { type: "radiogroup", name: "audience_mic", title: "Audience microphone needed for Q&A?", choices: ["Yes", "No"] },
          ],
        },
        {
          name: "page3",
          title: "Projection & Display",
          elements: [
            { type: "radiogroup", name: "projector_required", title: "Projector / Screen required?", choices: ["Yes", "No"] },
            { type: "dropdown", name: "screen_size", title: "Screen Size", choices: ["Small (up to 8ft)", "Medium (8-12ft)", "Large (12ft+)", "LED Wall"] },
            { type: "radiogroup", name: "speaker_brings_computer", title: "Speaker brings own computer?", choices: ["Yes", "No"] },
            { type: "radiogroup", name: "hdmi_required", title: "HDMI cord required?", choices: ["Yes", "No"] },
            { type: "radiogroup", name: "clicker_required", title: "Wireless remote clicker required?", choices: ["Yes", "No"] },
            { type: "radiogroup", name: "wifi_required", title: "WiFi access required?", choices: ["Yes", "No"] },
            { type: "comment", name: "av_notes", title: "Additional AV / Tech Notes" },
          ],
        },
      ],
    },
  },
  {
    key: "travel_contact",
    label: "Travel Contact Information",
    group: "Speaker Portal Forms",
    schema: {
      title: "Travel Contact Information",
      pages: [
        {
          name: "page1",
          title: "Personal Travel Contact Details",
          elements: [
            { type: "text", name: "legal_first_name", title: "Legal First Name", isRequired: true },
            { type: "text", name: "legal_last_name", title: "Legal Last Name", isRequired: true },
            { type: "text", name: "preferred_name", title: "Preferred Name" },
            { type: "text", name: "email", title: "Email", inputType: "email", isRequired: true },
            { type: "text", name: "phone", title: "Mobile Phone", isRequired: true },
            { type: "text", name: "emergency_contact_name", title: "Emergency Contact Name" },
            { type: "text", name: "emergency_contact_phone", title: "Emergency Contact Phone" },
            { type: "text", name: "home_address", title: "Home Address" },
            { type: "text", name: "home_city", title: "City" },
            { type: "text", name: "home_province", title: "Province / State" },
            { type: "text", name: "home_country", title: "Country" },
            { type: "text", name: "home_postal", title: "Postal / Zip Code" },
          ],
        },
      ],
    },
  },
  {
    key: "testimonials_endorsements",
    label: "Testimonials & Endorsements",
    group: "Speaker Portal Forms",
    schema: {
      title: "Testimonials & Endorsements",
      pages: [
        {
          name: "page1",
          title: "Add Testimonial",
          elements: [
            { type: "text", name: "testimonial_author", title: "Author Name", isRequired: true },
            { type: "text", name: "author_title", title: "Author Title / Position" },
            { type: "text", name: "author_organization", title: "Author Organization" },
            { type: "comment", name: "testimonial_text", title: "Testimonial Text", isRequired: true },
            { type: "text", name: "event_name", title: "Event Name (if applicable)" },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date" },
            { type: "radiogroup", name: "permission_to_publish", title: "Permission to publish on website?", choices: ["Yes", "No"], isRequired: true },
          ],
        },
      ],
    },
  },
  {
    key: "speaker_introduction",
    label: "Speaker Introduction",
    group: "Speaker Portal Forms",
    schema: {
      title: "Speaker Introduction",
      pages: [
        {
          name: "page1",
          title: "Introduction Script",
          elements: [
            { type: "comment", name: "intro_script", title: "Introduction Script (for the emcee to read aloud)", isRequired: true },
            { type: "text", name: "pronunciation_guide", title: "Name Pronunciation Guide" },
            { type: "text", name: "preferred_title", title: "Preferred Title (e.g. Dr., Mr., Ms.)" },
            { type: "comment", name: "intro_notes", title: "Notes for the Emcee" },
          ],
        },
      ],
    },
  },
  {
    key: "speaker_fee_relationship",
    label: "Speaker Fee, Relationship & Collaboration",
    group: "Speaker Portal Forms",
    schema: {
      title: "Speaker Fee, Relationship & Collaboration",
      pages: [
        {
          name: "page1",
          title: "Speaking Fees",
          elements: [
            { type: "dropdown", name: "fee_range_inperson", title: "In-Person Speaking Fee Range", choices: ["Under $5,000", "$5,000–$10,000", "$10,000–$20,000", "$20,000–$35,000", "$35,000–$50,000", "$50,000+"] },
            { type: "dropdown", name: "fee_range_virtual", title: "Virtual Speaking Fee Range", choices: ["Under $2,500", "$2,500–$5,000", "$5,000–$10,000", "$10,000–$20,000", "$20,000+"] },
            { type: "radiogroup", name: "fee_negotiable", title: "Is your fee negotiable for non-profits / associations?", choices: ["Yes", "No", "Case by Case"] },
            { type: "comment", name: "fee_notes", title: "Fee Notes" },
          ],
        },
        {
          name: "page2",
          title: "Relationship & Collaboration",
          elements: [
            { type: "radiogroup", name: "exclusive_agency", title: "Are you exclusively represented by SBC?", choices: ["Yes", "No"] },
            { type: "comment", name: "other_agencies", title: "Other agencies representing you (if any)" },
            { type: "radiogroup", name: "open_to_collaboration", title: "Open to collaboration with other SBC speakers?", choices: ["Yes", "No", "Maybe"] },
            { type: "comment", name: "collaboration_notes", title: "Collaboration Notes" },
            { type: "comment", name: "relationship_notes", title: "Additional Notes for SBC" },
          ],
        },
      ],
    },
  },
  {
    key: "topic_descriptions",
    label: "Topic Description",
    group: "Speaker Portal Forms",
    schema: {
      title: "Topic Descriptions",
      pages: [
        {
          name: "page1",
          title: "Topic 1",
          elements: [
            { type: "text", name: "topic_1_title", title: "Topic Title", isRequired: true },
            { type: "comment", name: "topic_1_description", title: "Topic Description (250 words max)", isRequired: true },
            { type: "comment", name: "topic_1_outcomes", title: "3 Key Outcomes for the Audience" },
            { type: "dropdown", name: "topic_1_duration", title: "Typical Duration", choices: ["30 minutes", "45 minutes", "60 minutes", "90 minutes", "Half Day", "Full Day"] },
          ],
        },
        {
          name: "page2",
          title: "Topic 2 (optional)",
          elements: [
            { type: "text", name: "topic_2_title", title: "Topic Title" },
            { type: "comment", name: "topic_2_description", title: "Topic Description (250 words max)" },
            { type: "comment", name: "topic_2_outcomes", title: "3 Key Outcomes for the Audience" },
            { type: "dropdown", name: "topic_2_duration", title: "Typical Duration", choices: ["30 minutes", "45 minutes", "60 minutes", "90 minutes", "Half Day", "Full Day"] },
          ],
        },
        {
          name: "page3",
          title: "Topic 3 (optional)",
          elements: [
            { type: "text", name: "topic_3_title", title: "Topic Title" },
            { type: "comment", name: "topic_3_description", title: "Topic Description (250 words max)" },
            { type: "comment", name: "topic_3_outcomes", title: "3 Key Outcomes for the Audience" },
            { type: "dropdown", name: "topic_3_duration", title: "Typical Duration", choices: ["30 minutes", "45 minutes", "60 minutes", "90 minutes", "Half Day", "Full Day"] },
          ],
        },
      ],
    },
  },
  {
    key: "video_media_articles",
    label: "Video, Media & Articles",
    group: "Speaker Portal Forms",
    schema: {
      title: "Video, Media & Articles",
      pages: [
        {
          name: "page1",
          title: "Video Links",
          elements: [
            { type: "text", name: "demo_video_url", title: "Demo Reel / Sizzle Video URL", isRequired: true },
            { type: "text", name: "keynote_video_url", title: "Full Keynote Video URL" },
            { type: "text", name: "media_interview_url", title: "Media Interview URL" },
            { type: "comment", name: "video_notes", title: "Video Notes" },
          ],
        },
        {
          name: "page2",
          title: "Media & Articles",
          elements: [
            { type: "text", name: "article_1_title", title: "Article / Publication 1 — Title" },
            { type: "text", name: "article_1_url", title: "Article 1 URL" },
            { type: "text", name: "article_2_title", title: "Article / Publication 2 — Title" },
            { type: "text", name: "article_2_url", title: "Article 2 URL" },
            { type: "text", name: "article_3_title", title: "Article / Publication 3 — Title" },
            { type: "text", name: "article_3_url", title: "Article 3 URL" },
            { type: "comment", name: "media_notes", title: "Additional Media Notes" },
          ],
        },
      ],
    },
  },
  {
    key: "value_add_social_media",
    label: "Value Add & Social Media",
    group: "Speaker Portal Forms",
    schema: {
      title: "Value Add & Social Media",
      pages: [
        {
          name: "page1",
          title: "Social Media Profiles",
          elements: [
            { type: "text", name: "linkedin_url", title: "LinkedIn URL" },
            { type: "text", name: "twitter_handle", title: "Twitter / X Handle" },
            { type: "text", name: "instagram_handle", title: "Instagram Handle" },
            { type: "text", name: "facebook_url", title: "Facebook URL" },
            { type: "text", name: "youtube_url", title: "YouTube Channel URL" },
            { type: "text", name: "tiktok_handle", title: "TikTok Handle" },
            { type: "text", name: "podcast_url", title: "Podcast URL" },
          ],
        },
        {
          name: "page2",
          title: "Value Add Offerings",
          elements: [
            { type: "checkbox", name: "value_adds", title: "Value Add Offerings Available", choices: ["Book Signing", "Meet & Greet", "Workshop", "Breakout Session", "Masterclass", "Webinar", "Podcast Guest", "Social Media Shoutout", "Other"] },
            { type: "comment", name: "value_add_details", title: "Describe your value add offerings" },
            { type: "radiogroup", name: "book_available", title: "Do you have a published book?", choices: ["Yes", "No"] },
            { type: "text", name: "book_title", title: "Book Title(s)" },
            { type: "text", name: "book_purchase_url", title: "Book Purchase URL" },
          ],
        },
      ],
    },
  },
  {
    key: "speaker_media_kit",
    label: "Speaker Media Kit",
    group: "Speaker Portal Forms",
    schema: {
      title: "Speaker Media Kit",
      pages: [
        {
          name: "page1",
          title: "Media Kit Assets",
          elements: [
            { type: "text", name: "headshot_url", title: "Professional Headshot URL (high resolution)" },
            { type: "text", name: "action_photo_url", title: "Action / On-Stage Photo URL" },
            { type: "text", name: "media_kit_pdf_url", title: "Media Kit PDF URL" },
            { type: "text", name: "one_sheet_url", title: "One-Sheet PDF URL" },
            { type: "text", name: "logo_url", title: "Personal Brand Logo URL" },
          ],
        },
        {
          name: "page2",
          title: "Brand & Appearance",
          elements: [
            { type: "comment", name: "brand_colours", title: "Brand Colours (hex codes or descriptions)" },
            { type: "text", name: "preferred_font", title: "Preferred Font (if applicable)" },
            { type: "comment", name: "brand_guidelines", title: "Brand / Usage Guidelines for SBC" },
            { type: "comment", name: "media_kit_notes", title: "Additional Notes" },
          ],
        },
      ],
    },
  },
  {
    key: "speaker_payment",
    label: "Speaker Payment Form",
    group: "Speaker Portal Forms",
    schema: {
      title: "Speaker Payment Form",
      pages: [
        {
          name: "page1",
          title: "Payee Information",
          elements: [
            { type: "text", name: "legal_business_name", title: "Legal Business / Payee Name", isRequired: true },
            { type: "text", name: "business_number", title: "Business Number / GST / HST Number" },
            { type: "text", name: "billing_address", title: "Billing Address", isRequired: true },
            { type: "text", name: "billing_city", title: "City", isRequired: true },
            { type: "text", name: "billing_province", title: "Province / State" },
            { type: "text", name: "billing_postal", title: "Postal / Zip Code" },
            { type: "text", name: "billing_country", title: "Country" },
          ],
        },
        {
          name: "page2",
          title: "Banking Details",
          elements: [
            { type: "dropdown", name: "payment_method", title: "Preferred Payment Method", isRequired: true, choices: ["EFT / Direct Deposit", "Wire Transfer", "Cheque", "PayPal", "Other"] },
            { type: "text", name: "bank_name", title: "Bank Name" },
            { type: "text", name: "bank_transit_number", title: "Transit Number" },
            { type: "text", name: "bank_institution_number", title: "Institution Number" },
            { type: "text", name: "bank_account_number", title: "Account Number" },
            { type: "text", name: "paypal_email", title: "PayPal Email (if applicable)" },
            { type: "comment", name: "payment_notes", title: "Payment Notes" },
          ],
        },
      ],
    },
  },

  // ── WEBSITE FORMS ──
  {
    key: "event_media",
    label: "Event Media (speakerscanada.com)",
    group: "Website Forms",
    schema: {
      title: "Event Media",
      pages: [
        {
          name: "page1",
          title: "Event Media Submission",
          elements: [
            { type: "text", name: "event_name", title: "Event Name", isRequired: true },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date", isRequired: true },
            { type: "text", name: "speaker_name", title: "Speaker Name", isRequired: true },
            { type: "text", name: "organization_name", title: "Organization / Host Name" },
            { type: "text", name: "photographer_name", title: "Photographer / Videographer Name" },
            { type: "text", name: "media_link", title: "Link to Media (Google Drive, Dropbox, etc.)" },
            { type: "comment", name: "media_description", title: "Describe the media being submitted" },
            { type: "radiogroup", name: "permission_to_publish", title: "Permission to publish on SBC website and social media?", isRequired: true, choices: ["Yes - Full Permission", "Yes - Website Only", "No"] },
            { type: "text", name: "submitter_name", title: "Your Name", isRequired: true },
            { type: "text", name: "submitter_email", title: "Your Email", inputType: "email", isRequired: true },
          ],
        },
      ],
    },
  },
  {
    key: "select_topic_types",
    label: "Select Topic and Types (speakerscanada.com)",
    group: "Website Forms",
    schema: {
      title: "Select Topic and Types",
      pages: [
        {
          name: "page1",
          title: "Event Type & Topics",
          elements: [
            { type: "dropdown", name: "event_type", title: "Event Type", isRequired: true, choices: ["Corporate", "Government", "Association", "Non-Profit", "Community", "Conference", "Gala / Awards", "Team Building", "Other"] },
            { type: "checkbox", name: "topics", title: "Speaking Topics of Interest", isRequired: true, choices: ["Leadership", "Innovation & Technology", "Mental Health & Wellness", "Diversity, Equity & Inclusion", "Sales & Business Development", "Resilience & Overcoming Adversity", "Finance & Economics", "Sustainability & Environment", "Healthcare", "Education", "Sports & Peak Performance", "Entrepreneurship", "Customer Experience", "Change Management", "Motivation & Inspiration", "Indigenous Perspectives", "Women in Leadership", "Other"] },
            { type: "dropdown", name: "audience_size", title: "Expected Audience Size", choices: ["Under 50", "50–150", "150–500", "500–1,000", "1,000+"] },
            { type: "dropdown", name: "budget_range", title: "Speaker Fee Budget", choices: ["Under $5,000", "$5,000–$10,000", "$10,000–$20,000", "$20,000–$35,000", "$35,000+", "Not Sure"] },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date" },
            { type: "dropdown", name: "delivery_format", title: "Delivery Format", choices: ["In-Person", "Virtual", "Hybrid"] },
            { type: "text", name: "event_city", title: "Event City" },
            { type: "text", name: "contact_name", title: "Your Name", isRequired: true },
            { type: "text", name: "contact_email", title: "Your Email", inputType: "email", isRequired: true },
            { type: "text", name: "contact_phone", title: "Your Phone" },
            { type: "comment", name: "additional_info", title: "Anything else we should know?" },
          ],
        },
      ],
    },
  },
];

const STORAGE_KEY = "sbc_form_schemas_v3";
const PASSWORD_KEY = "sbc_builder_auth";

function loadForms() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  const initial = {};
  SBC_FORMS.forEach((f) => { initial[f.key] = { ...f }; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveForms(forms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

function isAuthenticated() {
  return sessionStorage.getItem(PASSWORD_KEY) === "1";
}

// ─── PASSWORD SCREEN ─────────────────────────────────────────────────────────
function PasswordScreen({ onSuccess }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === CORRECT_PASSWORD) {
      sessionStorage.setItem(PASSWORD_KEY, "1");
      onSuccess();
    } else {
      setError("Incorrect password. Please try again.");
      setValue("");
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#ffffff",
      backgroundImage: "url('./backgrounds/leaf_full-1.png')",
      backgroundSize: "60%", backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      <div style={{ background: "#fff", borderRadius: 8, padding: "2.5rem 2rem", width: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", border: "1px solid #e8e8e8", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img src="./sbc_logo.png" alt="Speakers Bureau of Canada" style={{ width: 180, marginBottom: "1rem" }} />
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0B0C0C", fontFamily: "Georgia, serif" }}>Form Builder</div>
          <div style={{ fontSize: "0.82rem", color: "#7B868C", marginTop: "0.3rem" }}>Private access only</div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            placeholder="Enter password"
            autoFocus
            style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #ccc", borderRadius: 4, fontSize: "0.95rem", boxSizing: "border-box", marginBottom: "0.75rem" }}
          />
          {error && <div style={{ color: "#c62828", fontSize: "0.8rem", marginBottom: "0.6rem" }}>{error}</div>}
          <button type="submit" style={{ width: "100%", padding: "0.65rem", background: "#b71c1c", color: "#fff", border: "none", borderRadius: 4, fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── GROUPS ──────────────────────────────────────────────────────────────────
const GROUPS = ["Client / Event Forms", "Speaker Portal Forms", "Website Forms"];

// ─── RICH TEXT EDITOR PANEL ──────────────────────────────────────────────────
// This is a standalone rich-text editor panel that works like Word.
// Gordon types here, highlights text, applies bold/italic/underline/color/font/size.
// The result is saved as HTML in the form's notes/richText field.

const QUILL_MODULES = {
  toolbar: [
    [{ font: ["", "Georgia Pro", "IBM Plex Sans", "Verdana", "Arial"] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: ["#0B0C0C", "#D00000", "#9E1B32", "#3D4543", "#7B868C", "#1565c0", "#2e7d32", "#000000", "#ffffff"] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

const QUILL_FORMATS = ["font", "size", "bold", "italic", "underline", "strike", "color", "background", "align"];

function RichTextPanel({ value, onChange, label }) {
  return (
    <div style={{ padding: "1rem 1.25rem", background: "#fff", borderBottom: "2px solid #e0e0e0" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#546e7a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label || "Rich Text Notes / Formatted Content"}
        <span style={{ fontWeight: 400, color: "#9e9e9e", marginLeft: "0.5rem", textTransform: "none", letterSpacing: 0 }}>
          — Highlight text then click Bold, Color, Font etc. Works like Word.
        </span>
      </div>
      <div style={{ border: "1.5px solid #e0e0e0", borderRadius: 4, background: "#fff", minHeight: 120 }}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          style={{ fontFamily: "'IBM Plex Sans', Arial, sans-serif" }}
        />
      </div>
      <div style={{ fontSize: "0.68rem", color: "#9e9e9e", marginTop: "0.35rem" }}>
        This rich text block is saved with the form when you click Save. Export the form to send to your developer.
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [forms, setForms] = useState(() => loadForms());
  const [selectedKey, setSelectedKey] = useState(null);
  const [creator, setCreator] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [richText, setRichText] = useState("");
  const creatorRef = useRef(null);

  const openForm = (key) => {
    const form = forms[key];
    if (!form) return;

    const c = new SurveyCreator({
      showLogicTab: true,
      showTranslationTab: false,
      isAutoSave: false,
    });

    // Add "Text Box" items to the toolbox so Gordon can drag them in
    c.onSurveyInstanceCreated.add(() => {
      try {
        // Short text box
        c.toolbox.addItem({
          name: "sbc_textbox_short",
          title: "Text Box (Short)",
          iconName: "icon-text",
          category: "general",
          json: {
            type: "text",
            name: "text_box_short",
            title: "Enter your answer",
            maxLength: 150,
          },
        }, 0);
        // Long text box
        c.toolbox.addItem({
          name: "sbc_textbox_long",
          title: "Text Box (Long)",
          iconName: "icon-comment",
          category: "general",
          json: {
            type: "comment",
            name: "text_box_long",
            title: "Enter your answer",
            rows: 4,
          },
        }, 1);
      } catch (e) {
        // toolbox may not be ready yet, that's ok
      }
    });

    c.JSON = form.schema;

    // Restore saved rich text
    setRichText(form.richText || "");

    creatorRef.current = c;
    setCreator(c);
    setSelectedKey(key);
    setSaveStatus("");
  };

  // Add toolbox items after creator is mounted (fallback)
  useEffect(() => {
    if (!creator) return;
    try {
      // Remove existing custom items first to avoid duplicates
      try { creator.toolbox.removeItem("sbc_textbox_short"); } catch (e) {}
      try { creator.toolbox.removeItem("sbc_textbox_long"); } catch (e) {}

      creator.toolbox.addItem({
        name: "sbc_textbox_short",
        title: "Text Box (Short)",
        iconName: "icon-text",
        category: "general",
        json: {
          type: "text",
          name: "text_box_short",
          title: "Enter your answer",
          maxLength: 150,
        },
      }, 0);

      creator.toolbox.addItem({
        name: "sbc_textbox_long",
        title: "Text Box (Long)",
        iconName: "icon-comment",
        category: "general",
        json: {
          type: "comment",
          name: "text_box_long",
          title: "Enter your answer",
          rows: 4,
        },
      }, 1);
    } catch (e) {
      console.warn("Toolbox item add failed:", e);
    }
  }, [creator]);

  const handleSave = () => {
    if (!creatorRef.current || !selectedKey) return;
    const updated = {
      ...forms,
      [selectedKey]: {
        ...forms[selectedKey],
        schema: creatorRef.current.JSON,
        richText: richText,
      },
    };
    setForms(updated);
    saveForms(updated);
    setSaveStatus("Saved ✓");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleExport = () => {
    if (!creatorRef.current || !selectedKey) return;
    const payload = {
      schema: creatorRef.current.JSON,
      richText: richText,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedKey}.json`;
    a.click();
  };

  const handleExportAll = () => {
    const all = {};
    Object.entries(forms).forEach(([key, f]) => {
      all[key] = { schema: f.schema, richText: f.richText || "" };
    });
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sbc_all_forms.json";
    a.click();
  };

  const selectedForm = selectedKey ? forms[selectedKey] : null;

  if (!authed) return <PasswordScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f5f5f5" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 280, minWidth: 280, background: "#0B0C0C", color: "#fff", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid #3D4543", textAlign: "center" }}>
          <img src="./sbc_logo.png" alt="SBC" style={{ width: 130, marginBottom: "0.6rem", filter: "brightness(0) invert(1)" }} />
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif" }}>Form Builder</div>
          <div style={{ fontSize: "0.68rem", color: "#7B868C", marginTop: "0.2rem" }}>Click a form to open it</div>
        </div>

        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #3D4543" }}>
          <button onClick={handleExportAll} style={{ width: "100%", padding: "0.45rem", background: "#D00000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
            ↓ Export All Forms
          </button>
        </div>

        {/* Tip box */}
        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #3D4543", background: "#1a1a1a" }}>
          <div style={{ fontSize: "0.65rem", color: "#ef9a9a", fontWeight: 700, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>How to style text like Word</div>
          <div style={{ fontSize: "0.68rem", color: "#90a4ae", lineHeight: 1.5 }}>
            1. Open a form<br />
            2. Use the <strong style={{ color: "#fff" }}>Rich Text Editor</strong> below the form<br />
            3. Type your text, highlight words, pick Bold / Color / Font<br />
            4. Drag <strong style={{ color: "#fff" }}>Text Box (Short/Long)</strong> from the toolbox into the form<br />
            5. Click <strong style={{ color: "#D00000" }}>Save</strong> when done
          </div>
        </div>

        {GROUPS.map((group) => (
          <div key={group}>
            <div style={{ padding: "0.6rem 1rem 0.3rem", fontSize: "0.68rem", letterSpacing: "0.08em", color: "#ef9a9a", textTransform: "uppercase", fontWeight: 700 }}>{group}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {SBC_FORMS.filter((f) => f.group === group).map((f) => (
                <li key={f.key}>
                  <button
                    onClick={() => openForm(f.key)}
                    style={{
                      width: "100%", textAlign: "left", padding: "0.5rem 1rem",
                      background: selectedKey === f.key ? "#9E1B32" : "transparent",
                      color: selectedKey === f.key ? "#fff" : "#cfd8dc",
                      borderLeft: selectedKey === f.key ? "3px solid #D00000" : "3px solid transparent",
                      border: "none", cursor: "pointer", fontSize: "0.8rem", lineHeight: 1.4,
                    }}
                  >{f.label}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1.25rem", background: "#fff", borderBottom: "2px solid #D00000", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", flexShrink: 0 }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#333" }}>
            {selectedForm ? selectedForm.label : "← Select a form from the sidebar to start editing"}
          </div>
          {selectedKey && (
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              {saveStatus && <span style={{ fontSize: "0.8rem", color: "#2e7d32", fontWeight: 600 }}>{saveStatus}</span>}
              <button onClick={handleExport} style={{ padding: "0.4rem 1rem", background: "#f5f5f5", color: "#3D4543", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>↓ Export</button>
              <button onClick={handleSave} style={{ padding: "0.4rem 1.25rem", background: "#D00000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>Save</button>
            </div>
          )}
        </div>

        {/* Rich text editor — shown when a form is open */}
        {creator && (
          <RichTextPanel
            value={richText}
            onChange={setRichText}
            label={`Rich Text Block — ${selectedForm?.label || "Form"}`}
          />
        )}

        {/* Editor area */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {!creator && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              height: "100%",
              background: "#ffffff",
              backgroundImage: "url('./backgrounds/leaf_full-1.png')",
              backgroundSize: "60%", backgroundPosition: "center", backgroundRepeat: "no-repeat",
            }}>
              <div style={{ background: "#fff", borderRadius: 8, padding: "2rem 2.5rem", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", maxWidth: 480 }}>
                <img src="./sbc_logo.png" alt="SBC" style={{ width: 160, marginBottom: "1rem" }} />
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0B0C0C", fontFamily: "Georgia, serif" }}>Select a form from the sidebar</div>
                <div style={{ fontSize: "0.85rem", color: "#7B868C", marginTop: "0.5rem" }}>
                  Drag and drop fields to edit. Use the <strong>Rich Text Editor</strong> to style text like Word — highlight words and pick bold, color, font. Drag <strong>Text Box (Short/Long)</strong> from the toolbox. Click <strong>Save</strong> when done.
                </div>
              </div>
            </div>
          )}
          {creator && (
            <SurveyCreatorComponent creator={creator} style={{ height: "100%" }} />
          )}
        </div>
      </div>
    </div>
  );
}
