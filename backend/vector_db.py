from pymilvus import MilvusClient
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv, find_dotenv
import os

from milvus_abstraction import (
    DocumentSchema,
    QuestionSchema,
    MilvusInteraction,
    embed_from_text,
    get_closest_distance,
)


CLUSTER_ENDPOINT = "https://in03-841f674328869e6.api.gcp-us-west1.zillizcloud.com"  # Set your cluster endpoint
TOKEN = "7ac7f603b5c904ec69967d5bd1386eb958ba271c7aee24d867ab53fce126890ad7d3496a33597afd32db4459d050853da2c5494e"  # Set your token

# Initialize a MilvusClient instance
# Replace uri and token with your own
client = MilvusClient(
    uri=CLUSTER_ENDPOINT,  # Cluster endpoint obtained from the console
    token=TOKEN,  # API key or a colon-separated cluster username and password
)


def process_query(doc: str, query: str):
    print(query)
    closest_doc = MilvusInteraction(
        client=client, collectionName="DocumentCollection"
    ).search(text=doc)
    closest_doc_dist = get_closest_distance(closest_doc)
    print(f"closest doc distance: {closest_doc_dist}")
    if closest_doc_dist >= 0.99:
        doc_id = closest_doc[0][0]["id"]
        print(doc_id)
        closest_query = MilvusInteraction(
            client=client, collectionName="QuestionAnswerCollection"
        ).search(text=query, output_fields=["answer"], filter=f"documentId == {doc_id}")
        closest_query_dist = get_closest_distance(closest_query)
        print(f"closest query distance: {closest_query_dist}")
        if closest_query_dist >= 0.75:
            return closest_query[0][0]["entity"]["answer"]
        else:
            raise Exception("Query not found")
    else:
        raise Exception("Document not found")


# client.delete("DocumentCollection", ids=0)
# client.insert("DocumentCollection", data=test_data_dict)
# print(client.get("DocumentCollection", ids=1))

# process_query(test_data, "")
syllabus = """Page
1
of 6
Discrete Structures
CS 2800 Spring 2022 Syllabus – SUBJECT TO CHANGE
Course content
Course description
Discrete mathematics is the mathematical backbone of computer science. Contrary to continu-
ous mathematics (which includes, for example, calculus) which deals with objects that can take
on any value in a specified range, discrete mathematics deals with objects that can only take
distinct, separated, values. This course gives an introduction to concepts and structures in dis-
crete mathematics that are useful in describing and analyzing objects in computer science and
information science. This course will provide an introduction to the following topics:
• mathematical proofs, introduction to logic, and induction;
• sets, functions, relations, and graphs;
• number theory;
• combinatorics, and probability theory;
• automata;
• (if time permits) some graph theory and logic.
Topics will be discussed in the context of applications to various areas of computer science.
Learning outcomes
At the end of the course, you should be able to:
• use the basic objects of mathematics (sets, functions, relations, probability spaces, graphs)
to model problems arising in computer science;
• read and understand unfamiliar mathematical definitions, generate examples and coun-
terexamples, formulate precise definitions, determine whether a given object satisfies a
definition;
• write mathematical proofs (for example for algorithm correctness and analysis) that are
both clear and precise, using standard techniques (esp. induction); find errors in faulty
proofs;
• be proficient in using counting techniques and probabilistic arguments that are used for
algorithm analysis.
Prerequisites
The official prerequisite for course is a programming course. It is OK to take CS 1110 or CS 2110
concurrently.
1
Course access
• Lecture time & location: MWF 10:10-11am, Statler Auditorium (185).
First two weeks:
https://cornell.zoom.us/j/94767386734?pwd=clhESWNIRW5wVkJHOTZCZHpaUWxGZz09
• Discussion time & location: See Google calendar linked from Canvas site.
• Office hours time & location: See Google calendar linked from Canvas site.
• Asking questions:
– Please use Ed Discussions to ask questions about homework, exams, course logistics,
etc. You can make a private post if your inquiry is personal.
– You can make an appointment with the instructor using the Calendly 1-on-1 link from
Canvas. Appointments slots are limited, and are meant for discussing topics you can-
not discuss in public office hours (so not for homework questions!)
• Accessing course materials: We will be using Canvas to distribute homework and lecture
materials. You should be enrolled automatically into Canvas, but if not, please visit https:
//Canvas.cornell.edu and search for CS 2800. All announcements for the class will be
through Canvas and/or Ed Discussions, so it is your responsibility to ensure that you are
enrolled and receiving the announcements. Please contact the instructor or the TAs if you
have any issues. All websites we use (e.g., Gradescope for homework submission, Ed Dis-
cussions for Q&A) are linked from the course Canvas site.
Academic Excellence Workshop ENGRG 1028
Academic Excellence Workshop (AEW) sections are available to be taken in conjunction with this
course. AEWs are optional 1-credit supplemental courses which meet for one 2-hour collabora-
tive problem-solving session each week throughout the semester. Designed to enhance student
understanding, the workshops feature group work on problems at or above the level of course
instruction. In the workshops, small-group problem-solving is directed by undergraduate peer
educators called facilitators. The AEWs are graded S/U, based on attendance.
For this course there are two sections of ENGRG 1028 available: Mondays at 7.30pm and Tues-
days 2.40pm.
You can enroll online during the add period. Space is available, but may fill up quickly. If there
are no spots available in a section that fits your schedule, use the link included with the course
listing in the registration system to indicate your interest and availability. For more information
about AEWs, visit http://www.engineering.cornell.edu/aew.
Textbooks
• Mathematics for Computer Science by Eric Lehmann, Albert Meyer, and Tom Leighton.
This is our main text; the homework assignments and exams will have problems similar to
(or taken from) this text. It can be downloaded for free from https://courses.csail.
mit.edu/6.042/spring18/mcs.pdf.
2
• Discrete Mathematics ZY Book by Sandy Irani.
This optional interactive online text is available for $58. Access it using the reading assign-
ment on Canvas (go to Assignments in the course navigation menu on the left). This text
provides a plethora of participation activities for you to check your understanding of the
concepts introduced in class. These activities are a bit easier than the homework problems
you will need to solve, but students have reported they really help to get a solid under-
standing of the concepts taught in CS2800. Completing the activities will count towards
your participation credit (see below).
• Some useful backup texts are Discrete Algorithmic Mathematics by Stephen B. Maurer and
Anthony Ralston, A. K. Peters, Discrete Mathematics and its Applications by Kenneth Rosen,
and the lecture notes by Cornell’s Rafael Pass and Wei-Lung Dustin Tseng https://www.
cs.cornell.edu/~rafael/discmath.pdf.
The material on automata is not covered in our two main texts; you will be provided with
a copy of a chapter of Rosen’s book and of Pass and Tseng’s notes for this material.
Course work
Participation
• Lectures include short interactive exercises (via PollEverywhere) which invite you to think
about the material and check your understanding. Lecture participation counts for 25% of
your participation grade.
• Reading assignments related to the material discussed in lecture will be posted on Canvas.
There are two textbooks and you can, but are not required to, read either or both. The in-
teractive reading assignments in the ZYBook count towards your participation grade. The
reading assignments will have a deadline by which you need to complete the activities to
get credit. There is no credit for activities completed after this time. Reading participation
counts for 25% of your participation grade.
• Discussion sections will not introduce new material, but they will give you an opportunity to
work together with your peers and TAs. Participation credit for discussion is based on the
percentage of discussions during which you actively worked on the material provided that
week. If you attend but are not working on the discussion, the discussion TAs have the right
to mark you absent. Discussion participation counts for 75% of your participation grade.
The learning activities during lectures, reading, and discussion sections are meant to help
you check your understanding, and count towards your participation grade; this means that you
are not expected to give the correct answer, but that we do expect you to make an effort to learn.
Because different people have different preferences on how to learn and keep up with the
material, the three categories of participation credit add up to 125%; this means you have multiple
options for getting a perfect score (but your score is capped at 100%).
3
Homework
The goal of homework is to make you think deeper about and work with the material in the course,
thereby reinforcing the material. The homework (and discussion exercises) are meant to be chal-
lenging, and to take some time to solve. So do not panic if you do not immediately see how to
approach a problem, and do not ask for help straight away; you learn much more if you manage
to find a way forward on your own after a bit of struggle. In other words, the goal of the home-
work is meant as an exercise to sharpen your understanding and to find possible holes in your
understanding. If you do not do your own homework, then this setup does not work. We grade
the homework to give you feedback and help you pinpoint which parts of the course you fully
understand and which you have to review.
Homework will be assigned every week, and will be collected via Gradescope; there will be
approximately 9-10 homework assignments in total. It is OK if you handwrite your answers and
upload a photo (converted to a single pdf), or, alternatively, you can typeset them using LaTeX.
We will post the LaTeX source files of the homework for those of you who want to typeset your
answers in the same file.
Homework policies
• The lowest assigment grade is dropped.
• Late assignments are accepted until 24 hours after the deadline.
• You can submit one late assignment for any reason with no penalty; in addition, you can
submit one late assignment because you are ill with covid or your week is disrupted because
of contact tracing or quarantining.
• Subsequent late assignments will have the following penalties applied: 0–5 minutes: no
penalty; 5–30 minutes: 5%, 30–60 minutes: 20%, 1 – 24 hours : 50% penalty.
• Regrade requests for homework assignments and exams should be submitted on Grade-
scope, within five days of when grades are released. We will regrade the entire exam or
problem set; your score may go up or down.
• You are allowed and even encouraged to discuss the homework problems with your class-
mates. However, you have to write down the solutions on your own, without referring to any notes
taken while discussing the problems with classmates or TAs. Showing each other written solu-
tions, or writing out large parts of your solutions together, is not acceptable. Please indicate
on your homework the netIDs of your collaborators.
• Note that TAs do not have the solutions, and may make mistakes. Office hours are not for
checking your work for mistakes (this is what grading is for).
• You are not allowed to use sites like Chegg, Coursehero, or other sites that have homework
solutions. Posting questions from this course to these sites is a violation of copyright and
of Cornell’s academic integrity code. Getting answers from these sites deprives you of the
chance to struggle with the problems yourself – and you really do not want to postpone
that struggle to the exam!
• Violations of the homework collaboration policy or accessing homework solutions found
4
online result in a score of negative 50% (−50%) for the assignment.
Exams
The goal of the exams is to reinforce the material, by giving you an incentive to review the ma-
terial, and for us to check that you understand the material at a sufficient level to be able to use
it in future courses.
There will be two prelims and a final exam. The prelim exams are scheduled for the following
two dates: Thursday March 17, 7:30pm and Thursday April 21, 7:30pm. The date for the final
exam is to be determined. The exams will be held in-person.
In addition, there might be in-class quizzes.
Exam policies
• Clear guidelines will be given about what course materials you will be allowed to access
while taking the exams.
• Communicating with any person or accessing unauthorized resources during the exam is
considered to be a violation of academic integrity. Not reporting requests of other students
who ask for help is also a violation.
• Violations of academic integrity during a prelim or final exam result in an F in the course.
Grade determination
90% is 100% for participation and homework
The percentage of completed polls for lecture participation, completed exercises for reading, and
actively attended discussions each get multiplied by 10/9 (rounded down to 100 if necessary).
Similarly, grades for each homework are 10/9 times the raw grade for the homework (rounded
down to 100 if necessary).
Weighting of course components
The following table gives ranges for the weights used for the different parts that make up your
final grade. I will compute your score by setting each weight to its lowest value (giving 80% of
your score) and then increasing the weight of the components on which you scored highest to
their highest value to get to 100%.
Homework 15-25%
Participation 5-10%
Prelim 1 (and Quiz 1) 15-25%
Prelim 2 (and Quiz 2) 15-25%
Final exam 30-40%
5
General policies
We urge you to talk to the instructor or any of the TAs if you have any concerns about your learn-
ing, grades, or progress in the course, or if you get sick or if you have other difficulties. You can
make an appointment for a 1-on-1 meeting with professor Van Zuylen at https://calendly.
com/avz2/15min. Other resources at Cornell are also available (caringcommunity.cornell.
edu).
Please do not use email to ask questions about the material, policies, exam dates, etc. You
can submit questions like these to Ed Discussion, where everyone can view the reply as well (and
don’t forget to search whether a question has been asked already).
We cannot accommodate requests for exceptions for minor issues (not being able to answer
poll questions due to WiFi issues, leaving early for a break, forgetting to submit a homework, as
examples) — the course policies and grading scheme have been set up to take care of this. We are,
of course, more than willing to accommodate major unexpected events (for instance, you being
hospitalized unexpectedly, death of a close family member). In case you get sick, or there is some
other unexpected emergency, please set up a meeting or send an email, and we will figure out
how to handle the situation together.
Accommodations
We provide the usual academic accommodations for students with special needs and/or disabil-
ities. Requests for academic accommodations are to be made during the first three weeks of the
semester and must be accompanied by official documentation. Please register with Student Dis-
ability Services to document your eligibility.
Please talk to the instructor or TAs if there you have requests because of the current circum-
stances that do not fit under the “usual accommodations”, and we will work together to see if
and how we can accommodate your requests.
Academic integrity
Each student in this course is expected to abide by the Cornell University Code of Academic In-
tegrity. Any work submitted by a student in this course for academic credit will be the student’s
own work. Complete code is available at http://cuinfo.cornell.edu/Academic/AIC.html.
Prohibition against buying and selling of course materials
Course materials, posted on Canvas, Zoom/Video on Demand, Gradescope, Ed Discussions, or
otherwise, are intellectual property belonging to the author/instructor. Students are prohib-
ited from posting, buying or selling any course materials without the express permission of the
instructor.
"""

# syllabus_vec = embed_from_text(syllabus)
# client.insert(
#     "DocumentCollection",
#     data={"documentVector": syllabus_vec, "documentText": syllabus},
# )

q = embed_from_text("What class is this for?")
client.insert(
    "QuestionAnswerCollection",
    data={
        "questionVector": q,
        "answer": "Discrete Structures",
        "documentId": 448985163764207963,
        "timestamp": 1,
    },
)

# print(process_query(syllabus, "What semester is this syllabus from?"))
