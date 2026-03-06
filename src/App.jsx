import { useState, useEffect, useRef, useCallback } from "react";
// Dynamic import cache for survey-creator-react (avoids Vite CJS interop null issue)
let _surveyCreatorLibCache = null;
async function getSurveyCreatorLibAsync() {
  if (_surveyCreatorLibCache && _surveyCreatorLibCache.SurveyCreator) return _surveyCreatorLibCache;
  const mod = await import("survey-creator-react");
  // Vite production build exports CJS module as mod.s (minified)
  // Dev build may use mod.default
  // Try all possible locations
  let lib = null;
  if (mod && mod.default && mod.default.SurveyCreator) {
    lib = mod.default;
  } else {
    // Find the key that has SurveyCreator on it
    for (const key of Object.keys(mod || {})) {
      const val = mod[key];
      if (val && typeof val === 'object' && val.SurveyCreator) {
        lib = val;
        break;
      }
    }
  }
  if (!lib) lib = mod; // fallback
  console.log('[SBC] getSurveyCreatorLibAsync resolved, lib.SurveyCreator:', typeof (lib && lib.SurveyCreator));
  _surveyCreatorLibCache = lib;
  return lib;
}
import "survey-creator-core/survey-creator-core.min.css";
import "survey-core/defaultV2.min.css";

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
          ],
        },
        {
          name: "page3",
          title: "Virtual Event Details",
          elements: [
            { type: "text", name: "event_name", title: "Event Name", isRequired: true },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date", isRequired: true },
            { type: "text", name: "session_start_time", title: "Session Start Time", inputType: "time" },
            { type: "text", name: "session_end_time", title: "Session End Time", inputType: "time" },
            { type: "dropdown", name: "virtual_platform", title: "Virtual Platform", choices: ["Zoom", "Microsoft Teams", "Webex", "Google Meet", "Hopin", "Other"] },
            { type: "text", name: "meeting_link", title: "Meeting Link / URL" },
            { type: "text", name: "meeting_id", title: "Meeting ID" },
            { type: "text", name: "meeting_password", title: "Meeting Password" },
            { type: "text", name: "expected_attendees", title: "Expected Number of Attendees" },
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
          title: "Event Overview",
          elements: [
            { type: "text", name: "event_name", title: "Event Name", isRequired: true },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date", isRequired: true },
            { type: "text", name: "speaker_name", title: "Speaker Name", isRequired: true },
            { type: "text", name: "topic", title: "Topic / Presentation Title", isRequired: true },
            { type: "dropdown", name: "virtual_platform", title: "Virtual Platform", choices: ["Zoom", "Microsoft Teams", "Webex", "Google Meet", "Hopin", "Other"] },
            { type: "text", name: "meeting_link", title: "Meeting Link" },
          ],
        },
        {
          name: "page2",
          title: "Schedule",
          elements: [
            { type: "text", name: "green_room_time", title: "Green Room / Tech Check Time", inputType: "time" },
            { type: "text", name: "session_start", title: "Session Start Time", inputType: "time" },
            { type: "text", name: "session_end", title: "Session End Time", inputType: "time" },
            { type: "comment", name: "run_of_show", title: "Run of Show / Agenda Notes" },
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
      title: "In-Person Itinerary",
      pages: [
        {
          name: "page1",
          title: "Event Overview",
          elements: [
            { type: "text", name: "event_name", title: "Event Name", isRequired: true },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date", isRequired: true },
            { type: "text", name: "speaker_name", title: "Speaker Name", isRequired: true },
            { type: "text", name: "topic", title: "Topic / Presentation Title", isRequired: true },
            { type: "text", name: "venue_name", title: "Venue Name", isRequired: true },
            { type: "text", name: "venue_address", title: "Venue Address" },
            { type: "text", name: "venue_city", title: "City" },
          ],
        },
        {
          name: "page2",
          title: "Schedule",
          elements: [
            { type: "text", name: "arrival_time", title: "Speaker Arrival Time", inputType: "time" },
            { type: "text", name: "soundcheck_time", title: "Sound Check / AV Check Time", inputType: "time" },
            { type: "text", name: "session_start", title: "Session Start Time", inputType: "time" },
            { type: "text", name: "session_end", title: "Session End Time", inputType: "time" },
            { type: "comment", name: "run_of_show", title: "Run of Show / Agenda Notes" },
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
          title: "AV & Technical Requirements",
          elements: [
            { type: "checkbox", name: "av_equipment", title: "AV Equipment Required", choices: ["Podium Microphone", "Lapel Microphone", "Handheld Microphone", "Projector", "Screen", "Clicker / Presenter Remote", "Confidence Monitor", "Livestream Setup", "Recording Equipment"] },
            { type: "comment", name: "av_notes", title: "Additional AV Notes" },
          ],
        },
        {
          name: "page2",
          title: "Room & Logistics",
          elements: [
            { type: "dropdown", name: "room_setup", title: "Room Setup Style", choices: ["Theatre", "Classroom", "Boardroom", "Banquet / Rounds", "U-Shape", "Other"] },
            { type: "text", name: "room_capacity", title: "Room Capacity" },
            { type: "radiogroup", name: "green_room_required", title: "Green Room Required?", choices: ["Yes", "No"] },
            { type: "comment", name: "green_room_notes", title: "Green Room Notes" },
            { type: "radiogroup", name: "parking_required", title: "Parking Required?", choices: ["Yes", "No"] },
            { type: "comment", name: "parking_notes", title: "Parking Notes" },
            { type: "comment", name: "additional_notes", title: "Additional On-Site Notes" },
          ],
        },
      ],
    },
  },
  {
    key: "travel_agent_form",
    label: "Travel Agent Form",
    group: "Client / Event Forms",
    schema: {
      title: "Travel Agent Form",
      pages: [
        {
          name: "page1",
          title: "Travel Agent Information",
          elements: [
            { type: "text", name: "agent_first_name", title: "Agent First Name", isRequired: true },
            { type: "text", name: "agent_last_name", title: "Agent Last Name", isRequired: true },
            { type: "text", name: "agency_name", title: "Agency Name", isRequired: true },
            { type: "text", name: "agent_email", title: "Agent Email", inputType: "email", isRequired: true },
            { type: "text", name: "agent_phone", title: "Agent Phone", isRequired: true },
          ],
        },
        {
          name: "page2",
          title: "Booking Details",
          elements: [
            { type: "text", name: "speaker_name", title: "Speaker Name", isRequired: true },
            { type: "text", name: "event_date", title: "Event Date", inputType: "date", isRequired: true },
            { type: "text", name: "event_city", title: "Event City", isRequired: true },
            { type: "dropdown", name: "travel_class", title: "Travel Class", choices: ["Economy", "Premium Economy", "Business", "First Class"] },
            { type: "radiogroup", name: "hotel_required", title: "Hotel Required?", choices: ["Yes", "No"] },
            { type: "text", name: "hotel_check_in", title: "Hotel Check-In Date", inputType: "date" },
            { type: "text", name: "hotel_check_out", title: "Hotel Check-Out Date", inputType: "date" },
            { type: "comment", name: "travel_notes", title: "Special Travel Notes or Requirements" },
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
          title: "Flight Preferences",
          elements: [
            { type: "text", name: "home_airport", title: "Home Airport (City / Code)", isRequired: true },
            { type: "dropdown", name: "preferred_airline", title: "Preferred Airline", choices: ["Air Canada", "WestJet", "Porter Airlines", "United Airlines", "Delta", "American Airlines", "No Preference", "Other"] },
            { type: "text", name: "frequent_flyer", title: "Frequent Flyer Number(s)" },
            { type: "dropdown", name: "seat_preference", title: "Seat Preference", choices: ["Aisle", "Window", "No Preference"] },
            { type: "dropdown", name: "travel_class", title: "Travel Class", choices: ["Economy", "Premium Economy", "Business", "First Class"] },
          ],
        },
        {
          name: "page2",
          title: "Hotel Preferences",
          elements: [
            { type: "dropdown", name: "hotel_chain", title: "Preferred Hotel Chain", choices: ["Marriott", "Hilton", "Hyatt", "IHG", "Best Western", "No Preference", "Other"] },
            { type: "text", name: "hotel_loyalty", title: "Hotel Loyalty Number(s)" },
            { type: "dropdown", name: "room_type", title: "Room Type Preference", choices: ["King", "Queen", "Double", "No Preference"] },
            { type: "radiogroup", name: "early_checkin", title: "Early Check-In Required?", choices: ["Yes", "No", "If Available"] },
            { type: "comment", name: "hotel_notes", title: "Additional Hotel Notes" },
          ],
        },
        {
          name: "page3",
          title: "Ground Transportation",
          elements: [
            { type: "radiogroup", name: "ground_transport", title: "Preferred Ground Transportation", choices: ["Rental Car", "Taxi / Rideshare", "Shuttle", "Host Provided", "No Preference"] },
            { type: "comment", name: "transport_notes", title: "Transportation Notes" },
            { type: "comment", name: "dietary_restrictions", title: "Dietary Restrictions / Food Allergies" },
            { type: "comment", name: "accessibility_needs", title: "Accessibility Requirements" },
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
            { type: "text", name: "speaker_full_name", title: "Full Name", isRequired: true },
            { type: "comment", name: "short_bio", title: "Short Bio (100 words max)", isRequired: true },
            { type: "comment", name: "full_bio", title: "Full Bio (400 words max)", isRequired: true },
            { type: "comment", name: "credentials", title: "Key Credentials / Certifications" },
            { type: "comment", name: "notable_clients", title: "Notable Clients / Organizations" },
            { type: "text", name: "website", title: "Personal Website URL" },
            { type: "text", name: "linkedin", title: "LinkedIn Profile URL" },
          ],
        },
      ],
    },
  },
  {
    key: "av_tech_requirements",
    label: "AV-Tech Requirement",
    group: "Speaker Portal Forms",
    schema: {
      title: "AV / Technical Requirements",
      pages: [
        {
          name: "page1",
          title: "Presentation Setup",
          elements: [
            { type: "radiogroup", name: "slide_deck", title: "Do you use a slide deck?", isRequired: true, choices: ["Yes", "No"] },
            { type: "dropdown", name: "slide_software", title: "Slide Software", choices: ["PowerPoint", "Keynote", "Google Slides", "Prezi", "Other", "N/A"] },
            { type: "radiogroup", name: "own_laptop", title: "Do you bring your own laptop?", isRequired: true, choices: ["Yes", "No"] },
            { type: "dropdown", name: "laptop_os", title: "Laptop Operating System", choices: ["Windows", "Mac", "N/A"] },
            { type: "checkbox", name: "connectors_needed", title: "Connectors / Adapters Needed", choices: ["HDMI", "VGA", "USB-C", "DisplayPort", "None"] },
          ],
        },
        {
          name: "page2",
          title: "Audio & Microphone",
          elements: [
            { type: "dropdown", name: "mic_preference", title: "Microphone Preference", choices: ["Lapel / Lavalier", "Handheld", "Podium", "Headset", "No Preference"] },
            { type: "radiogroup", name: "audio_playback", title: "Do you require audio playback during your presentation?", choices: ["Yes", "No"] },
            { type: "comment", name: "audio_notes", title: "Audio Notes" },
            { type: "comment", name: "additional_av_notes", title: "Additional AV Notes" },
          ],
        },
      ],
    },
  },
  {
    key: "travel_contact_info",
    label: "Travel Contact Information",
    group: "Speaker Portal Forms",
    schema: {
      title: "Travel Contact Information",
      pages: [
        {
          name: "page1",
          title: "Personal Travel Information",
          elements: [
            { type: "text", name: "legal_first_name", title: "Legal First Name (as on ID)", isRequired: true },
            { type: "text", name: "legal_last_name", title: "Legal Last Name (as on ID)", isRequired: true },
            { type: "text", name: "date_of_birth", title: "Date of Birth", inputType: "date" },
            { type: "dropdown", name: "id_type", title: "Primary ID Type", choices: ["Canadian Passport", "US Passport", "Other Passport", "NEXUS", "Driver's License"] },
            { type: "text", name: "passport_number", title: "Passport Number" },
            { type: "text", name: "passport_expiry", title: "Passport Expiry Date", inputType: "date" },
            { type: "text", name: "nationality", title: "Nationality" },
            { type: "text", name: "emergency_contact_name", title: "Emergency Contact Name" },
            { type: "text", name: "emergency_contact_phone", title: "Emergency Contact Phone" },
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
          title: "Testimonials",
          elements: [
            { type: "comment", name: "testimonial_1", title: "Testimonial 1", isRequired: true },
            { type: "text", name: "testimonial_1_name", title: "Name of Person", isRequired: true },
            { type: "text", name: "testimonial_1_title", title: "Title / Organization" },
            { type: "comment", name: "testimonial_2", title: "Testimonial 2" },
            { type: "text", name: "testimonial_2_name", title: "Name of Person" },
            { type: "text", name: "testimonial_2_title", title: "Title / Organization" },
            { type: "comment", name: "testimonial_3", title: "Testimonial 3" },
            { type: "text", name: "testimonial_3_name", title: "Name of Person" },
            { type: "text", name: "testimonial_3_title", title: "Title / Organization" },
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
            { type: "text", name: "speaker_name", title: "Speaker Name", isRequired: true },
            { type: "text", name: "topic_title", title: "Topic / Presentation Title", isRequired: true },
            { type: "comment", name: "intro_script_short", title: "Short Introduction (60 seconds)", isRequired: true },
            { type: "comment", name: "intro_script_full", title: "Full Introduction (2–3 minutes)" },
            { type: "comment", name: "pronunciation_notes", title: "Name Pronunciation Notes" },
            { type: "comment", name: "intro_instructions", title: "Special Instructions for Emcee / Host" },
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
          title: "Video Content",
          elements: [
            { type: "text", name: "demo_reel_url", title: "Demo Reel URL (YouTube / Vimeo)", isRequired: true },
            { type: "text", name: "keynote_clip_1", title: "Keynote Clip 1 URL" },
            { type: "text", name: "keynote_clip_2", title: "Keynote Clip 2 URL" },
            { type: "text", name: "keynote_clip_3", title: "Keynote Clip 3 URL" },
          ],
        },
        {
          name: "page2",
          title: "Media & Press",
          elements: [
            { type: "text", name: "press_article_1", title: "Press Article / Feature URL 1" },
            { type: "text", name: "press_article_2", title: "Press Article / Feature URL 2" },
            { type: "text", name: "podcast_appearance_1", title: "Podcast Appearance URL 1" },
            { type: "text", name: "podcast_appearance_2", title: "Podcast Appearance URL 2" },
            { type: "comment", name: "media_notes", title: "Media Notes" },
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
            { type: "text", name: "twitter_url", title: "Twitter / X URL" },
            { type: "text", name: "instagram_url", title: "Instagram URL" },
            { type: "text", name: "facebook_url", title: "Facebook URL" },
            { type: "text", name: "youtube_url", title: "YouTube Channel URL" },
            { type: "text", name: "tiktok_url", title: "TikTok URL" },
          ],
        },
        {
          name: "page2",
          title: "Value Add Offerings",
          elements: [
            { type: "checkbox", name: "value_adds", title: "Value Add Offerings Available", choices: ["Book Signing", "Workshop / Breakout Session", "Q&A Session", "Meet & Greet", "Pre-Event Webinar", "Post-Event Follow-Up", "Social Media Promotion", "Custom Video Message"] },
            { type: "comment", name: "value_add_notes", title: "Value Add Notes" },
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
            { type: "text", name: "headshot_url", title: "Professional Headshot URL (high-res)", isRequired: true },
            { type: "text", name: "action_photo_url", title: "Action / On-Stage Photo URL" },
            { type: "text", name: "logo_url", title: "Personal Logo / Brand URL (if applicable)" },
            { type: "text", name: "media_kit_pdf_url", title: "Media Kit PDF URL" },
            { type: "comment", name: "photo_usage_rights", title: "Photo Usage Rights / Restrictions" },
          ],
        },
      ],
    },
  },
  {
    key: "speaker_payment_form",
    label: "Speaker Payment Form",
    group: "Speaker Portal Forms",
    schema: {
      title: "Speaker Payment Form",
      pages: [
        {
          name: "page1",
          title: "Payment Details",
          elements: [
            { type: "text", name: "legal_name", title: "Legal Name (as on bank account)", isRequired: true },
            { type: "text", name: "business_name", title: "Business / Corporation Name (if applicable)" },
            { type: "text", name: "gst_hst_number", title: "GST / HST Number (if registered)" },
            { type: "dropdown", name: "payment_method", title: "Preferred Payment Method", choices: ["EFT / Direct Deposit", "Wire Transfer", "Cheque", "PayPal", "Other"] },
            { type: "text", name: "bank_institution", title: "Bank Institution Name" },
            { type: "text", name: "bank_transit", title: "Transit Number" },
            { type: "text", name: "bank_institution_number", title: "Institution Number" },
            { type: "text", name: "bank_account_number", title: "Account Number" },
            { type: "text", name: "paypal_email", title: "PayPal Email (if applicable)" },
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
            { type: "text", name: "photo_url_1", title: "Event Photo URL 1" },
            { type: "text", name: "photo_url_2", title: "Event Photo URL 2" },
            { type: "text", name: "video_url", title: "Event Video URL" },
            { type: "comment", name: "media_notes", title: "Media Notes" },
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

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "sbc_form_schemas_v3";
const PASSWORD_KEY = "sbc_builder_auth";
const GROUPS = ["Client / Event Forms", "Speaker Portal Forms", "Website Forms"];

const FONT_OPTIONS = [
  { label: "Georgia Pro (Headings)", value: "'Georgia Pro', Georgia, serif" },
  { label: "IBM Plex Sans (Body / UI)", value: "'IBM Plex Sans', Arial, sans-serif" },
  { label: "Verdana (Documents)", value: "Verdana, Geneva, sans-serif" },
  { label: "Georgia (Fallback)", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
];

const SIZE_OPTIONS = ["10px","11px","12px","13px","14px","16px","18px","20px","22px","24px","27px","32px","36px","38px"];

const COLOR_OPTIONS = [
  { label: "SBC Dark (default)", value: "#0B0C0C" },
  { label: "SBC Red", value: "#D00000" },
  { label: "SBC Deep Red", value: "#9E1B32" },
  { label: "SBC Dark Grey", value: "#3D4543" },
  { label: "SBC Grey", value: "#7B868C" },
  { label: "SBC Light", value: "#F7F7F7" },
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#000000" },
  { label: "Blue", value: "#1565c0" },
  { label: "Green", value: "#2e7d32" },
  { label: "Orange", value: "#e65100" },
  { label: "Purple", value: "#6a1b9a" },
];

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
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

// ─── SURVEY CREATOR WRAPPER ─────────────────────────────────────────────────
// Resolves the SurveyCreatorComponent lazily to handle Vite CJS interop
function SurveyCreatorComponentWrapper({ creator }) {
  const [Comp, setComp] = useState(null);
  useEffect(() => {
    getSurveyCreatorLibAsync().then((lib) => {
      if (lib && lib.SurveyCreatorComponent) setComp(() => lib.SurveyCreatorComponent);
    });
  }, []);
  if (!Comp) return null;
  return <Comp creator={creator} style={{ height: "100%" }} />;
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

// ─── STYLE BAR ───────────────────────────────────────────────────────────────
// Applies style to the SELECTED field only (not the whole form).
// When no field is selected, the controls are greyed out with a hint.
function StyleBar({ selectedQuestion, onApplyStyle }) {
  const [font, setFont] = useState("'IBM Plex Sans', Arial, sans-serif");
  const [size, setSize] = useState("14px");
  const [color, setColor] = useState("#0B0C0C");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const hasSelection = !!selectedQuestion;

  const apply = useCallback(() => {
    if (!hasSelection) return;
    onApplyStyle({ font, size, color, bold, italic, underline });
  }, [hasSelection, font, size, color, bold, italic, underline, onApplyStyle]);

  const s = {
    panel: {
      background: "#fff",
      borderBottom: "1px solid #e0e0e0",
      padding: "0.5rem 1.25rem",
      display: "flex",
      flexWrap: "wrap",
      gap: "0.6rem",
      alignItems: "center",
      opacity: hasSelection ? 1 : 0.5,
    },
    label: { fontSize: "0.72rem", color: "#546e7a", fontWeight: 600 },
    select: { fontSize: "0.78rem", padding: "0.25rem 0.4rem", border: "1px solid #ccc", borderRadius: 4, background: "#fafafa", cursor: hasSelection ? "pointer" : "not-allowed" },
    divider: { width: 1, height: 24, background: "#e0e0e0", margin: "0 0.2rem" },
    toggleBtn: (active) => ({
      padding: "0.25rem 0.55rem",
      background: active ? "#0B0C0C" : "#f5f5f5",
      color: active ? "#fff" : "#333",
      border: "1px solid #ccc",
      borderRadius: 4,
      cursor: hasSelection ? "pointer" : "not-allowed",
      fontSize: "0.82rem",
      fontWeight: 700,
      minWidth: 30,
    }),
    applyBtn: {
      padding: "0.3rem 0.9rem",
      background: hasSelection ? "#D00000" : "#ccc",
      color: "#fff",
      border: "none",
      borderRadius: 4,
      cursor: hasSelection ? "pointer" : "not-allowed",
      fontSize: "0.78rem",
      fontWeight: 700,
    },
  };

  return (
    <div style={s.panel}>
      <span style={s.label}>
        {hasSelection
          ? <span>Style: <strong style={{ color: "#D00000" }}>{selectedQuestion}</strong></span>
          : <span style={{ color: "#9e9e9e" }}>Click a field in the form to select it, then apply style</span>
        }
      </span>
      <div style={s.divider} />
      <span style={s.label}>Font:</span>
      <select style={s.select} value={font} disabled={!hasSelection} onChange={(e) => setFont(e.target.value)}>
        {FONT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={s.label}>Size:</span>
      <select style={s.select} value={size} disabled={!hasSelection} onChange={(e) => setSize(e.target.value)}>
        {SIZE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <div style={s.divider} />
      <span style={s.label}>Style:</span>
      <button style={s.toggleBtn(bold)} disabled={!hasSelection} onClick={() => setBold(!bold)} title="Bold"><strong>B</strong></button>
      <button style={s.toggleBtn(italic)} disabled={!hasSelection} onClick={() => setItalic(!italic)} title="Italic"><em>I</em></button>
      <button style={s.toggleBtn(underline)} disabled={!hasSelection} onClick={() => setUnderline(!underline)} title="Underline"><u>U</u></button>
      <div style={s.divider} />
      <span style={s.label}>Color:</span>
      <span style={{ width: 16, height: 16, borderRadius: "50%", border: "1px solid #ccc", display: "inline-block", background: color, verticalAlign: "middle" }} />
      <select style={s.select} value={color} disabled={!hasSelection} onChange={(e) => setColor(e.target.value)}>
        {COLOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input
        type="color"
        value={color}
        disabled={!hasSelection}
        onChange={(e) => setColor(e.target.value)}
        title="Pick custom color"
        style={{ width: 28, height: 28, padding: 0, border: "1px solid #ccc", borderRadius: 4, cursor: hasSelection ? "pointer" : "not-allowed", background: "none" }}
      />
      <div style={s.divider} />
      <button style={s.applyBtn} disabled={!hasSelection} onClick={apply}>
        Apply to Field
      </button>
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
  // Track which question is currently selected in the designer
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  // Store per-field styles: { questionName: { font, size, color, bold, italic, underline } }
  const [fieldStyles, setFieldStyles] = useState({});
  const creatorRef = useRef(null);
  const styleTagRef = useRef(null);
  const surveyLibRef = useRef(null);

  // Preload survey-creator-react on mount so openForm can use it synchronously
  useEffect(() => {
    getSurveyCreatorLibAsync().then((lib) => {
      surveyLibRef.current = lib;
    });
  }, []);

  // Inject per-field CSS whenever fieldStyles changes
  useEffect(() => {
    if (!styleTagRef.current) {
      const tag = document.createElement("style");
      tag.id = "sbc-field-styles";
      document.head.appendChild(tag);
      styleTagRef.current = tag;
    }
    // Build CSS rules for each styled field
    const rules = Object.entries(fieldStyles).map(([name, st]) => {
      const fontFamily = st.font ? `font-family: ${st.font} !important;` : "";
      const fontSize = st.size ? `font-size: ${st.size} !important;` : "";
      const color = st.color ? `color: ${st.color} !important;` : "";
      const fontWeight = st.bold ? "font-weight: bold !important;" : "";
      const fontStyle = st.italic ? "font-style: italic !important;" : "";
      const textDecoration = st.underline ? "text-decoration: underline !important;" : "";
      return `
        [data-name="${name}"] .sd-question__title,
        [data-name="${name}"] .sv-string-viewer,
        [data-name="${name}"] .sd-title {
          ${fontFamily} ${fontSize} ${color} ${fontWeight} ${fontStyle} ${textDecoration}
        }
      `;
    }).join("\n");
    styleTagRef.current.textContent = rules;
  }, [fieldStyles]);

  const openFormRef = useRef(null);
  openFormRef.current = (key) => {
    const form = forms[key];
    if (!form) return;

    const lib = surveyLibRef.current;
    console.log('[SBC] openForm called, key:', key, 'lib:', lib ? typeof lib.SurveyCreator : 'null');
    if (!lib || !lib.SurveyCreator) {
      // Library not yet loaded - wait for it
      getSurveyCreatorLibAsync().then((loadedLib) => {
        surveyLibRef.current = loadedLib;
        openForm(key);
      });
      return;
    }
    console.log('[SBC] Creating SurveyCreator...');
    const c = new lib.SurveyCreator({
      showLogicTab: true,
      showTranslationTab: false,
      isAutoSave: false,
    });

    console.log('[SBC] Creator created, onSelectedElementChanged:', typeof c.onSelectedElementChanged);
    c.JSON = form.schema;

    // Restore saved per-field styles
    setFieldStyles(form.fieldStyles || {});
    setSelectedQuestion(null);

    // Track which field is selected in the designer
    c.onSelectedElementChanged.add((sender, options) => {
      const el = options.newSelectedElement;
      if (el && el.name && el.getType && el.getType() !== "survey" && el.getType() !== "page") {
        setSelectedQuestion(el.name);
      } else {
        setSelectedQuestion(null);
      }
    });

    // Add text box items to toolbox directly
    try { c.toolbox.removeItem("sbc_textbox_short"); } catch (e) {}
    try { c.toolbox.removeItem("sbc_textbox_long"); } catch (e) {}
    try {
      c.toolbox.addItem({
        name: "sbc_textbox_short",
        title: "Text Box (Short)",
        iconName: "icon-text",
        category: "general",
        json: { type: "text", name: "text_box_short", title: "Enter your text here", maxLength: 150 },
      }, 0);
      c.toolbox.addItem({
        name: "sbc_textbox_long",
        title: "Text Box (Long)",
        iconName: "icon-comment",
        category: "general",
        json: { type: "comment", name: "text_box_long", title: "Enter your text here", rows: 4 },
      }, 1);
    } catch (e) { console.log('[SBC] toolbox.addItem error:', e.message); }

    creatorRef.current = c;
    setCreator(c);
    setSelectedKey(key);
    setSaveStatus("");
  };
  const openForm = (key) => openFormRef.current(key);

  // Add toolbox items after mount as fallback
  useEffect(() => {
    if (!creator) return;
    const timer = setTimeout(() => {
      try {
        try { creator.toolbox.removeItem("sbc_textbox_short"); } catch (e) {}
        try { creator.toolbox.removeItem("sbc_textbox_long"); } catch (e) {}
        creator.toolbox.addItem({
          name: "sbc_textbox_short",
          title: "Text Box (Short)",
          iconName: "icon-text",
          category: "general",
          json: { type: "text", name: "text_box_short", title: "Enter your text here", maxLength: 150 },
        }, 0);
        creator.toolbox.addItem({
          name: "sbc_textbox_long",
          title: "Text Box (Long)",
          iconName: "icon-comment",
          category: "general",
          json: { type: "comment", name: "text_box_long", title: "Enter your text here", rows: 4 },
        }, 1);
      } catch (e) {}
    }, 500);
    return () => clearTimeout(timer);
  }, [creator]);

  const handleApplyStyle = useCallback((style) => {
    if (!selectedQuestion) return;
    setFieldStyles((prev) => ({ ...prev, [selectedQuestion]: style }));
  }, [selectedQuestion]);

  const handleAddField = useCallback((size) => {
    if (!creatorRef.current) return;
    const name = `text_field_${Date.now()}`;
    const q = creatorRef.current.survey.currentPage?.addNewQuestion("text", name);
    if (q) {
      q.title = size === "small" ? "Short Text Field" : "Medium Text Field";
      if (size === "medium") q.maxLength = 500;
      else q.maxLength = 100;
    }
    setSaveStatus("Field added — click Save");
    setTimeout(() => setSaveStatus(""), 3000);
  }, []);

  const handleSave = useCallback(() => {
    if (!creatorRef.current || !selectedKey) return;
    const updated = {
      ...forms,
      [selectedKey]: {
        ...forms[selectedKey],
        schema: creatorRef.current.JSON,
        fieldStyles: fieldStyles,
      },
    };
    setForms(updated);
    saveForms(updated);
    setSaveStatus("Saved ✓");
    setTimeout(() => setSaveStatus(""), 3000);
  }, [forms, selectedKey, fieldStyles]);

  const handleExport = useCallback(() => {
    if (!creatorRef.current || !selectedKey) return;
    const payload = { schema: creatorRef.current.JSON, fieldStyles };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedKey}.json`;
    a.click();
  }, [selectedKey, fieldStyles]);

  const handleExportAll = useCallback(() => {
    const all = {};
    Object.entries(forms).forEach(([key, f]) => {
      all[key] = { schema: f.schema, fieldStyles: f.fieldStyles || {} };
    });
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sbc_all_forms.json";
    a.click();
  }, [forms]);

  const selectedForm = selectedKey ? forms[selectedKey] : null;

  if (!authed) return <PasswordScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f5f5f5" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 280, minWidth: 280, background: "#0B0C0C", color: "#fff", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid #3D4543", textAlign: "center" }}>
          <img src="./sbc_logo.png" alt="SBC" style={{ width: 130, marginBottom: "0.6rem", filter: "brightness(0) invert(1)" }} />
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif" }}>Form Builder</div>
          <div style={{ fontSize: "0.68rem", color: "#7B868C", marginTop: "0.2rem" }}>Click a form to edit it</div>
        </div>

        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #3D4543" }}>
          <button onClick={handleExportAll} style={{ width: "100%", padding: "0.45rem", background: "#D00000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
            ↓ Export All Forms
          </button>
        </div>

        {/* Add Text Field buttons */}
        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #3D4543" }}>
          <div style={{ fontSize: "0.65rem", color: "#ef9a9a", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.4rem", letterSpacing: "0.08em" }}>Add Text Field</div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => handleAddField("small")}
              disabled={!creator}
              style={{ flex: 1, padding: "0.4rem 0.3rem", background: creator ? "#9E1B32" : "#3D4543", color: "#fff", border: "none", borderRadius: 4, cursor: creator ? "pointer" : "not-allowed", fontSize: "0.75rem", fontWeight: 600 }}
            >＋ Small</button>
            <button
              onClick={() => handleAddField("medium")}
              disabled={!creator}
              style={{ flex: 1, padding: "0.4rem 0.3rem", background: creator ? "#9E1B32" : "#3D4543", color: "#fff", border: "none", borderRadius: 4, cursor: creator ? "pointer" : "not-allowed", fontSize: "0.75rem", fontWeight: 600 }}
            >＋ Medium</button>
          </div>
          <div style={{ fontSize: "0.65rem", color: "#546e7a", marginTop: "0.35rem" }}>Open a form first, then click to add</div>
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

        {/* Style bar — shown when a form is open */}
        {creator && (
          <StyleBar
            selectedQuestion={selectedQuestion}
            onApplyStyle={handleApplyStyle}
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
              backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat",
            }}>
              <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "2rem 2.5rem", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <img src="./sbc_logo.png" alt="SBC" style={{ width: 160, marginBottom: "1rem" }} />
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0B0C0C", fontFamily: "Georgia, serif" }}>Select a form from the sidebar</div>
                <div style={{ fontSize: "0.85rem", color: "#7B868C", marginTop: "0.5rem", maxWidth: 400 }}>
                  Drag and drop fields to edit. Use the <strong>Style Bar</strong> to set font, size, and color per field. Drag <strong>Text Box (Short/Long)</strong> from the toolbox. Click <strong>Save</strong> when done.
                </div>
              </div>
            </div>
          )}
          {creator && <SurveyCreatorComponentWrapper creator={creator} />}
        </div>
      </div>
    </div>
  );
}
