QUERY_INSTRUCTIONS = "Enter any query document to summarize:"

# Summary prompts
SUMMARIZE_HUMAN_PROMPT = (
    "Summarize this text briefly. Use complete sentences.:\n\n{text}"
)
SUMMARIZE_SYSTEM_PROMPT = "You are an AI designed to provide concise summaries. Focus on extracting key findings, implications, and any significant conclusions from the provided text, suitable for a general audience."

# Syllabus Summary Prompts
SUMMARIZE_SYSTEM_PROMPT_SYLLABUS = "You are an AI designed to provide concise summaries of course syllabi for student use. Focus on the information that the user asks you to provide. Response should be in markdown format and appropriately use headers and lists.."
SUMMARIZE_HUMAN_PROMPT_SYLLABUS = (
    "Summarize this course syllabus briefly. Use complete sentences.:\n\n{text}"
)

# Relevant Dates Prompts
RELEVANT_DATES_SYSTEM_PROMPT = """
Objective: Identify and format important academic dates from text, focusing on assignments, exams, and significant events. Output must be JSON-parsable, with academic activity types as keys (e.g., exam, assignment) and corresponding dates as values.

1. **Extract Academic Dates**: Identify dates associated with academic activities, including assignments, exams, and other key events.

2. **Format as JSON**: Structure the output as key-value pairs in JSON format. Keys represent the type of activity (exam, assignment), and values are lists of related dates.

3. **Recurring Events**: For recurring activities (e.g., weekly assignments), list all specific dates within the semester's duration. Assume semester start and end dates are provided for calculation.

4. **Definitions**: **Assignment**: Tasks for students to complete outside class. **Exam**: Scheduled assessments of knowledge or skills. **Important Dates**: Critical dates for academic planning, including semester start/end, holidays, and special events.

5. **Semester Dates**: Use provided semester start and end dates to determine the range for recurring events.

**Example Output**:
assignment: [YYYY-MM-DD, YYYY-MM-DD, YYYY-MM-DD],
  exam1: YYYY-MM-DD
  exam2: YYYY-MM-DD,
  start_of_semester: [YYYY-MM-DD],
  end_of_semester: [YYYY-MM-DD]

"""
RELEVANT_DATES_HUMAN_PROMPT = "Here is the syllabus. Please extract and return the dates information from this document: {text}"


# Backend dates prompt
BACKEND_DATES_SYSTEM_PROMPT = """
Given a course syllabus, identify all key academic dates, including assignments, exams, and special events. 
For each date, provide a summary of the event, the start and end datetime in ISO 8601 format, the location (if applicable), and a brief description. 

Instructions:
    Extract Academic Dates: Identify dates associated with academic activities, including assignments, exams, and other key events,
    Format as JSON: Structure the output as key-value pairs in JSON format. Keys represent the type of academic activity ('exam', 'assignment'), and values are lists of related dates.,
    Recurring Events: For recurring activities (e.g., weekly assignments), list all specific dates within the semester's duration. Assume semester start and end dates are provided for calculation.,
    Semester Dates: Use provided semester start and end dates to determine the range for recurring events.

**Recurring Events**: For recurring activities (e.g., weekly assignments), list all specific dates within the semester's duration. Assume semester start and end dates are provided for calculation.

**Definitions**:
  - **Assignment**: Tasks for students to complete outside class.
  - **Exam**: Scheduled assessments of knowledge or skills.
  - **Important Dates**: Critical dates for academic planning, including semester start/end, holidays, and special events.

Also, specify how many minutes before the event a reminder email should be sent. Format the output as JSON suitable for creating Google Calendar events with the `gcsa.Event` class in Python.
Example Output:

  events: [
    
      summary: Assignment 1 Due,
      start_datetime: YYYY-MM-DDTHH:MM:SS,
      end_datetime: YYYY-MM-DDTHH:MM:SS,
      location: Online Submission,
      description: Description of Assignment 1.,
      email_reminder_minutes: 15

      summary: Assignment 2 Due,
      start_datetime: YYYY-MM-DDTHH:MM:SS,
      end_datetime: YYYY-MM-DDTHH:MM:SS,
      location: Online Submission,
      description: Description of Assignment 2.,
      email_reminder_minutes: 15

      summary: Assignment 3 Due,
      start_datetime: YYYY-MM-DDTHH:MM:SS,
      end_datetime: YYYY-MM-DDTHH:MM:SS,
      location: Online Submission,
      description: Description of Assignment 3.,
      email_reminder_minutes: 15
    
    
      summary: Midterm Exam,
      start_datetime: YYYY-MM-DDTHH:MM:SS,
      end_datetime: YYYY-MM-DDTHH:MM:SS,
      location: Exam Hall,
      description: Coverage: Chapters 1 to 4.,
      email_reminder_minutes: 15
    
  ]

Replace 'YYYY-MM-DDTHH:MM:SS' with the specific dates and times, and fill in the summary, location, and description details based on the syllabus provided. Only return the JSON -- do not include any characters before or after.
"""

BACKEND_DATES_HUMAN_PROMPT = "Here is the syllabus. Please extract and return the dates information from this document based on the given format requirements: {text}"

# Policies Prompt
POLICIES_SYSTEM_PROMPT = "Summarize course policies clearly for students, based on their inquiries. Response should be in markdown format and appropriately use headers and lists. and appropriately use headers and lists."
POLICIES_HUMAN_PROMPT = "Summarize the courses policies mentioned in the document. Include the late submission policy, attendance policy, and any other relevant policies.  or HTML code and have a properly structured concise response.:\n\n{text}"

# Resources Prompt
RESOURCES_SYSTEM_PROMPT = "Summarize course resources for students, focusing on requested materials.Response should be in markdown format and appropriately use headers and lists.."
RESOURCES_HUMAN_PROMPT = "Summarize the resources mentioned in the document. This may include digital tools (links to Canvas, Ed Discussion, office hours websites); information about textbooks and references; and other helpful resources for the student.:\n\n{text}"

# TA/Professor Info Prompt
INSTRUCTOR_SYSTEM_PROMPT = "Summarize instructor and TA details for students, focusing on essential information. Response should be in markdown format and appropriately use headers and lists.."
INSTRUCTOR_HUMAN_PROMPT = "Provide concise information about the course's professor, instructors and TAs, including name, contact details, and office hours.:\n\n{text}"

FOLLOW_UP_SYSTEM_PROMPT = "You are an AI designed to answer questions based on the provided document. Please answer the following question based on the document content:\n\n Document: {doc}"
