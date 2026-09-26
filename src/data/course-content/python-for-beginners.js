const pythonForBeginners = {
  slug: "python-for-beginners",
  tag: "Programming",
  title: "Python for Beginners",
  image: "/images/Python.png",
  color: "bg-blue-500",
  description: "Core syntax, working with data structures, and organizing code into functions.",
  lessons: [
    {
      title: "Running Python and print()",
      body: "Python code runs line by line from top to bottom. print() shows output, and it's the quickest way to see what your program is doing.",
      code: `# hello.py
print("Hello, Python!")
print("2 + 3 =", 2 + 3)

# Run it in the terminal:
# python hello.py`,
      after: "Lines starting with # are comments — Python ignores them.",
    },
    {
      title: "Variables and Types",
      body: "Variables are created the moment you assign them — no keyword needed. Python works out the type from the value.",
      code: `name = "Meera"      # str
age = 19            # int
height = 1.62       # float
is_enrolled = True  # bool

print(type(age))    # <class 'int'>`,
      after: "Python uses snake_case for variable names, like is_enrolled.",
    },
    {
      title: "Strings and f-strings",
      body: "Strings hold text. f-strings let you put variables directly inside text by adding f before the quotes.",
      code: `course = "Python"
lessons = 12

print(f"{course} has {lessons} lessons.")
print(course.upper())     # PYTHON
print(course[0])          # P
print(len(course))        # 6`,
      after: "Strings can't be changed in place; methods like .upper() return a new string.",
    },
    {
      title: "String Methods",
      body: "Strings come with built-in methods for cleaning and searching text. split() breaks a string into a list, and join() glues a list back into one string.",
      code: `raw = "  Learn Python Today  "

clean = raw.strip()
print(clean.lower())                  # learn python today
print(clean.replace("Today", "Now"))  # Learn Python Now
print(clean.startswith("Learn"))      # True

words = clean.split(" ")
print(words)                          # ['Learn', 'Python', 'Today']
print("-".join(words))                # Learn-Python-Today`,
      after: "Call .strip() on user input to remove stray spaces before comparing it.",
    },
    {
      title: "Numbers and Math",
      body: "Python handles whole numbers and decimals, with operators for every common calculation. // divides and rounds down, and % gives the remainder.",
      code: `print(7 / 2)    # 3.5
print(7 // 2)   # 3
print(7 % 2)    # 1
print(2 ** 3)   # 8

total = round(19.987, 2)
print(total)    # 19.99`,
      after: "% is useful for checking even numbers: n % 2 == 0.",
    },
    {
      title: "Input and Type Conversion",
      body: "input() reads text the user types. It always returns a string, so convert it with int() or float() before doing math.",
      code: `name = input("Your name: ")
age = int(input("Your age: "))

print(f"Hi {name}, next year you'll be {age + 1}.")`,
      after: "If someone types letters where a number is expected, int() raises a ValueError.",
    },
    {
      title: "Booleans and Logical Operators",
      body: "Comparisons like == and > produce True or False. The operators and, or, and not combine these values into bigger conditions.",
      code: `age = 20
has_ticket = True

print(age >= 18)                  # True
print(age == 21)                  # False
print(age >= 18 and has_ticket)   # True
print(age < 13 or has_ticket)     # True
print(not has_ticket)             # False

print(bool(""), bool("hi"))       # False True`,
      after: "Empty values like 0, \"\", and [] count as False in a condition.",
    },
    {
      title: "Conditionals",
      body: "if, elif, and else choose which code runs. Python uses indentation instead of curly braces to show which lines belong to each branch.",
      code: `score = 78

if score >= 90:
    print("Excellent")
elif score >= 60:
    print("Passed")
else:
    print("Try again")`,
      after: "Use four spaces for each level of indentation, and be consistent.",
    },
    {
      title: "Lists",
      body: "A list is an ordered collection you can change. You can add, remove, and loop over items, and slicing grabs a range.",
      code: `fruits = ["apple", "banana", "mango"]

fruits.append("orange")
fruits.remove("banana")

print(fruits[0])     # apple
print(fruits[-1])    # orange
print(fruits[0:2])   # ['apple', 'mango']`,
      after: "Negative indexes count from the end, so [-1] is always the last item.",
    },
    {
      title: "Loops",
      body: "for loops go through each item in a collection, and while loops repeat as long as a condition is true. range() generates a sequence of numbers.",
      code: `for fruit in ["apple", "mango"]:
    print(fruit)

for i in range(3):
    print(i)   # 0, 1, 2

count = 3
while count > 0:
    print(count)
    count -= 1`,
      after: "Make sure a while loop's condition eventually becomes false, or it runs forever.",
    },
    {
      title: "break and continue",
      body: "break stops a loop immediately, and continue skips the rest of the current pass and moves to the next one. Together they give you fine control over loops.",
      code: `for n in range(1, 10):
    if n % 2 == 0:
        continue      # skip even numbers
    if n > 7:
        break         # stop the loop entirely
    print(n)          # 1, 3, 5, 7

while True:
    answer = input("Type quit to stop: ")
    if answer == "quit":
        break`,
      after: "A while True loop with a break inside is a common pattern for repeating until the user is done.",
    },
    {
      title: "List Comprehensions",
      body: "A list comprehension builds a new list in a single line. You can transform each item and optionally filter with an if at the end.",
      code: `numbers = [1, 2, 3, 4, 5, 6]

squares = [n * n for n in numbers]
print(squares)    # [1, 4, 9, 16, 25, 36]

evens = [n for n in numbers if n % 2 == 0]
print(evens)      # [2, 4, 6]

names = ["asha", "ravi"]
print([name.title() for name in names])  # ['Asha', 'Ravi']`,
      after: "If a comprehension gets hard to read, switch back to a regular for loop.",
    },
    {
      title: "Dictionaries",
      body: "Dictionaries store key-value pairs, like a word and its definition. Look up values by key instead of position.",
      code: `student = {"name": "Arjun", "age": 20, "grade": "A"}

print(student["name"])       # Arjun
student["age"] = 21
student["city"] = "Pune"

for key, value in student.items():
    print(key, "->", value)`,
      after: "Use student.get(\"email\") to avoid an error when a key might not exist.",
    },
    {
      title: "Tuples and Sets",
      body: "Tuples are like lists that can't be changed after creation. Sets hold unique values only, with duplicates dropped automatically.",
      code: `point = (4, 7)
x, y = point          # unpacking
print(x, y)           # 4 7

tags = {"python", "code", "python"}
print(tags)           # {'python', 'code'}
print("code" in tags) # True`,
      after: "Converting a list to a set is the fastest way to remove duplicates.",
    },
    {
      title: "Functions",
      body: "Functions package code under a name so you can reuse it. They take parameters, can have default values, and return results.",
      code: `def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Divya"))          # Hello, Divya!
print(greet("Divya", "Hi"))    # Hi, Divya!

def average(numbers):
    return sum(numbers) / len(numbers)

print(average([70, 80, 90]))   # 80.0`,
      after: "A function without a return statement gives back None.",
    },
    {
      title: "Keyword Arguments and *args",
      body: "You can pass arguments by name, so their order no longer matters. Adding *args lets a function accept any number of positional values as a tuple.",
      code: `def make_profile(name, age, city="Unknown"):
    return f"{name}, {age}, from {city}"

print(make_profile(age=22, name="Kiran"))
print(make_profile("Kiran", 22, city="Delhi"))

def total(*args):
    return sum(args)

print(total(1, 2))          # 3
print(total(5, 10, 15))     # 30`,
      after: "Keyword arguments make calls with many parameters much easier to read.",
    },
    {
      title: "Handling Errors with try/except",
      body: "When something goes wrong, Python raises an exception and stops the program. A try/except block catches the error so you can handle it gracefully.",
      code: `try:
    age = int(input("Your age: "))
    print(f"In ten years you'll be {age + 10}.")
except ValueError:
    print("Please enter a whole number.")

try:
    result = 10 / 0
except ZeroDivisionError:
    print("You can't divide by zero.")
finally:
    print("Done.")`,
      after: "Catch specific exceptions like ValueError rather than using a bare except.",
    },
    {
      title: "Modules and Files",
      body: "Modules are files of Python code you can import. Python ships with many useful ones, and the with statement opens files safely and closes them for you.",
      code: `import random
from datetime import date

print(random.randint(1, 6))
print(date.today())

with open("notes.txt", "w") as f:
    f.write("Learning Python\\n")

with open("notes.txt") as f:
    print(f.read())`,
      after: "Install extra packages from the internet with pip install, like pip install requests.",
    },
    {
      title: "Classes and Objects",
      body: "A class is a blueprint for creating objects that bundle data and behavior together. __init__ sets up each new object, and self refers to that object.",
      code: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says woof!"

rex = Dog("Rex", 3)
print(rex.name)      # Rex
print(rex.bark())    # Rex says woof!

rex.age += 1
print(rex.age)       # 4`,
      after: "Class names use CapitalizedWords, like Dog or BankAccount, by convention.",
    },
  ],
  quizzes: [
    {
      id: "python-basics",
      title: "Python Basics",
      description: "Lessons 1–6: printing, variables, strings, numbers, and user input.",
      questions: [
        { id: "q1", prompt: "What does a line starting with # do in Python?", options: [{ id: "a", text: "Prints a heading" }, { id: "b", text: "Marks a comment that Python ignores" }, { id: "c", text: "Imports a module" }, { id: "d", text: "Declares a variable" }], correct: "b", explanation: "Python skips everything after # on a line, so it is used for comments." },
        { id: "q2", prompt: "Which naming style does Python use for variables?", options: [{ id: "a", text: "camelCase" }, { id: "b", text: "PascalCase" }, { id: "c", text: "snake_case" }, { id: "d", text: "kebab-case" }], correct: "c", explanation: "Python variable names use snake_case, like is_enrolled." },
        { id: "q3", prompt: "If course = \"Python\" and lessons = 12, what does print(f\"{course} has {lessons} lessons.\") show?", options: [{ id: "a", text: "Python has 12 lessons." }, { id: "b", text: "{course} has {lessons} lessons." }, { id: "c", text: "A SyntaxError" }, { id: "d", text: "f{course} has {lessons} lessons." }], correct: "a", explanation: "An f-string replaces each {name} with the value of that variable." },
        { id: "q4", prompt: "What does \"  hi  \".strip() return?", options: [{ id: "a", text: "\"  hi\"" }, { id: "b", text: "\"hi  \"" }, { id: "c", text: "[\"hi\"]" }, { id: "d", text: "\"hi\"" }], correct: "d", explanation: "strip() removes whitespace from both ends of a string." },
        { id: "q5", prompt: "What does \"a,b,c\".split(\",\") return?", options: [{ id: "a", text: "\"abc\"" }, { id: "b", text: "[\"a\", \"b\", \"c\"]" }, { id: "c", text: "(\"a\", \"b\", \"c\")" }, { id: "d", text: "\"a b c\"" }], correct: "b", explanation: "split() breaks a string into a list at each separator." },
        { id: "q6", prompt: "What is the result of 7 // 2?", options: [{ id: "a", text: "3.5" }, { id: "b", text: "1" }, { id: "c", text: "3" }, { id: "d", text: "4" }], correct: "c", explanation: "// divides and rounds down to a whole number." },
        { id: "q7", prompt: "What type does input() always return?", options: [{ id: "a", text: "A string" }, { id: "b", text: "An int" }, { id: "c", text: "A float" }, { id: "d", text: "It depends on what the user types" }], correct: "a", explanation: "input() always returns text, so you convert it with int() or float() for math." },
        { id: "q8", prompt: "What happens if int() is given text like \"abc\"?", options: [{ id: "a", text: "It returns 0" }, { id: "b", text: "It returns None" }, { id: "c", text: "It returns the text unchanged" }, { id: "d", text: "It raises a ValueError" }], correct: "d", explanation: "int() cannot convert letters to a number, so it raises a ValueError." },
      ],
    },
    {
      id: "logic-and-collections",
      title: "Logic and Collections",
      description: "Lessons 7–13: booleans, conditionals, lists, loops, comprehensions, and dictionaries.",
      questions: [
        { id: "q1", prompt: "What does True and False evaluate to?", options: [{ id: "a", text: "True" }, { id: "b", text: "False" }, { id: "c", text: "None" }, { id: "d", text: "An error" }], correct: "b", explanation: "and is only True when both sides are True." },
        { id: "q2", prompt: "Which of these values counts as False in a condition?", options: [{ id: "a", text: "\"hello\"" }, { id: "b", text: "1" }, { id: "c", text: "[]" }, { id: "d", text: "[0]" }], correct: "c", explanation: "Empty values like [], \"\", and 0 are treated as False." },
        { id: "q3", prompt: "What does Python use to show which lines belong to an if branch?", options: [{ id: "a", text: "Curly braces" }, { id: "b", text: "Indentation" }, { id: "c", text: "Semicolons" }, { id: "d", text: "The end keyword" }], correct: "b", explanation: "Python uses indentation, typically four spaces, to group code into blocks." },
        { id: "q4", prompt: "Given fruits = [\"apple\", \"mango\", \"orange\"], what is fruits[-1]?", options: [{ id: "a", text: "\"orange\"" }, { id: "b", text: "\"apple\"" }, { id: "c", text: "\"mango\"" }, { id: "d", text: "An IndexError" }], correct: "a", explanation: "Negative indexes count from the end, so [-1] is the last item." },
        { id: "q5", prompt: "What does range(3) produce in a for loop?", options: [{ id: "a", text: "1, 2, 3" }, { id: "b", text: "0, 1, 2, 3" }, { id: "c", text: "3, 2, 1" }, { id: "d", text: "0, 1, 2" }], correct: "d", explanation: "range(3) starts at 0 and stops before 3." },
        { id: "q6", prompt: "What does continue do inside a loop?", options: [{ id: "a", text: "Ends the loop completely" }, { id: "b", text: "Restarts the loop from the first item" }, { id: "c", text: "Skips to the next pass of the loop" }, { id: "d", text: "Pauses the program" }], correct: "c", explanation: "continue skips the rest of the current pass and moves on to the next one." },
        { id: "q7", prompt: "What does [n * 2 for n in [1, 2, 3]] produce?", options: [{ id: "a", text: "[2, 4, 6]" }, { id: "b", text: "[1, 2, 3, 1, 2, 3]" }, { id: "c", text: "[1, 4, 9]" }, { id: "d", text: "6" }], correct: "a", explanation: "The comprehension doubles each item and collects the results in a new list." },
        { id: "q8", prompt: "How can you look up a dictionary key without an error if it might not exist?", options: [{ id: "a", text: "student[\"email\"]" }, { id: "b", text: "student.get(\"email\")" }, { id: "c", text: "student.find(\"email\")" }, { id: "d", text: "student.email" }], correct: "b", explanation: "get() returns None instead of raising an error when the key is missing." },
      ],
    },
    {
      id: "functions-and-objects",
      title: "Functions and Objects",
      description: "Lessons 14–19: tuples, sets, functions, errors, files, and classes.",
      questions: [
        { id: "q1", prompt: "What is the main difference between a tuple and a list?", options: [{ id: "a", text: "Tuples can't be changed after creation" }, { id: "b", text: "Tuples can only hold numbers" }, { id: "c", text: "Tuples are always sorted" }, { id: "d", text: "Tuples can't be looped over" }], correct: "a", explanation: "Tuples are immutable, while lists can be changed." },
        { id: "q2", prompt: "What does a function return if it has no return statement?", options: [{ id: "a", text: "0" }, { id: "b", text: "An empty string" }, { id: "c", text: "None" }, { id: "d", text: "An error" }], correct: "c", explanation: "A function without return gives back None." },
        { id: "q3", prompt: "In def total(*args), what type is args inside the function?", options: [{ id: "a", text: "A list" }, { id: "b", text: "A dictionary" }, { id: "c", text: "A set" }, { id: "d", text: "A tuple" }], correct: "d", explanation: "*args collects the extra positional values into a tuple." },
        { id: "q4", prompt: "Why use keyword arguments like make_profile(age=22, name=\"Kiran\")?", options: [{ id: "a", text: "They run faster" }, { id: "b", text: "Their order no longer matters" }, { id: "c", text: "They make parameters optional" }, { id: "d", text: "They convert values to strings" }], correct: "b", explanation: "Passing arguments by name means you don't need to follow the parameter order." },
        { id: "q5", prompt: "Which block runs when an error is raised inside try?", options: [{ id: "a", text: "The matching except block" }, { id: "b", text: "The else block" }, { id: "c", text: "The elif block" }, { id: "d", text: "The with block" }], correct: "a", explanation: "The matching except block catches the error and handles it." },
        { id: "q6", prompt: "What is the main benefit of opening a file with the with statement?", options: [{ id: "a", text: "It makes the file read-only" }, { id: "b", text: "It reads the file faster" }, { id: "c", text: "It closes the file for you automatically" }, { id: "d", text: "It creates a backup copy" }], correct: "c", explanation: "with opens the file safely and closes it when the block ends." },
        { id: "q7", prompt: "In a class method, what does self refer to?", options: [{ id: "a", text: "The class itself" }, { id: "b", text: "The parent module" }, { id: "c", text: "The first argument passed by the caller" }, { id: "d", text: "The specific object the method is called on" }], correct: "d", explanation: "self refers to the object being created or used, like rex in rex.bark()." },
        { id: "q8", prompt: "Which method sets up each new object when it is created from a class?", options: [{ id: "a", text: "__init__" }, { id: "b", text: "__start__" }, { id: "c", text: "__new_object__" }, { id: "d", text: "setup" }], correct: "a", explanation: "__init__ runs automatically to set up a new object's data." },
      ],
    },
  ],
};

export default pythonForBeginners;
