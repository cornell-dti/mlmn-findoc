from gcsa.google_calendar import GoogleCalendar
from gcsa.event import Event
from gcsa.recurrence import Recurrence, DAILY, SU, SA
from beautiful_date import Jan, Apr, BeautifulDate


def add_event_to_calendar(
    summary,
    start_datetime,
    end_datetime,
    description=None,
    location=None,
    email_reminder_minutes=None,
    user_email="primary",
):
    print(user_email)
    try:
        calendar = GoogleCalendar(
            credentials_path="./credentials.json",
            default_calendar=user_email,
            save_token=False,
        )
    except Exception as e:
        print("Error in exporting to gle Calendar: ", e)
        print(e)
        raise e
    event = Event(
        summary=summary,
        start=start_datetime,
        end=end_datetime,
        location=location,
        description=description,
        minutes_before_email_reminder=email_reminder_minutes,
    )
    calendar.add_event(event)
