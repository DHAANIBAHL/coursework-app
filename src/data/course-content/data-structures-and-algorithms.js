const dataStructuresAndAlgorithms = {
  slug: "data-structures-and-algorithms",
  tag: "Computer Science",
  title: "Data Structures & Algorithms",
  image: "/images/Data Structures.png",
  color: "bg-violet-600",
  description: "Measuring efficiency with Big O, core data structures, and classic searching and sorting algorithms.",
  lessons: [
    {
      title: "Algorithms and Big O",
      body: "An algorithm is a step-by-step recipe for solving a problem. Big O notation describes how the number of steps grows as the input gets bigger, ignoring constants and small details.",
      code: `def find_max(numbers):
    largest = numbers[0]
    for n in numbers:      # one step per item
        if n > largest:
            largest = n
    return largest

print(find_max([4, 9, 2, 7]))  # 9

# 10 items -> about 10 steps
# 1,000,000 items -> about 1,000,000 steps
# Steps grow with the input: O(n), linear time`,
      after: "Big O usually describes the worst case, so you know how slow things can get.",
    },
    {
      title: "Common Complexities Compared",
      body: "Most algorithms fall into a handful of growth rates. For a million items, O(log n) is about 20 steps, O(n) is a million, and O(n^2) is a trillion.",
      code: `# O(1)        constant:     nums[0]
# O(log n)    logarithmic:  binary search
# O(n)        linear:       one loop over the list
# O(n log n)  linearithmic: merge sort
# O(n^2)      quadratic:    a loop inside a loop

def has_duplicate(nums):          # O(n^2)
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False`,
      after: "Nested loops over the same data are a common sign of O(n^2) code.",
    },
    {
      title: "Lists and Their Costs",
      body: "A Python list stores items side by side, like an array, so reading any index is instant. Adding or removing at the front is slow because every other item has to shift.",
      code: `nums = [10, 20, 30, 40]

print(nums[2])        # O(1): jump straight to an index
nums.append(50)       # O(1) on average: add to the end
nums.pop()            # O(1): remove from the end

nums.insert(0, 5)     # O(n): every item shifts right
nums.pop(0)           # O(n): every item shifts left
print(30 in nums)     # O(n): checks items one by one`,
      after: "Work at the end of a list whenever you can, since that's where it's fast.",
    },
    {
      title: "Linear Search",
      body: "Linear search checks each item in turn until it finds the target. It works on any list, sorted or not, and takes O(n) time in the worst case.",
      code: `def linear_search(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1

names = ["Asha", "Ravi", "Meera", "Kiran"]
print(linear_search(names, "Meera"))  # 2
print(linear_search(names, "Divya"))  # -1`,
      after: "Python's in operator and list.index() both do a linear search under the hood.",
    },
    {
      title: "Binary Search",
      body: "Binary search finds an item in a sorted list by checking the middle and throwing away the half that can't contain the target. Halving the search space each time makes it O(log n).",
      code: `def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1    # search the right half
        else:
            high = mid - 1   # search the left half
    return -1

scores = [12, 25, 37, 48, 56, 71, 89]
print(binary_search(scores, 56))  # 4`,
      after: "Binary search only works on sorted data; the bisect module has a ready-made version.",
    },
    {
      title: "Stacks",
      body: "A stack is last in, first out, like a pile of plates. A Python list works as a stack: append() pushes onto the top and pop() removes from the top, both in O(1).",
      code: `def is_balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)          # push
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False          # pop didn't match
    return not stack

print(is_balanced("(a[b]{c})"))  # True
print(is_balanced("(]"))         # False`,
      after: "Stacks power undo buttons, the browser back button, and bracket matching.",
    },
    {
      title: "Queues with deque",
      body: "A queue is first in, first out, like a line at a ticket counter. Use collections.deque, because its popleft() is O(1) while list.pop(0) is O(n).",
      code: `from collections import deque

queue = deque()
queue.append("Asha")     # join the back
queue.append("Ravi")
queue.append("Meera")

print(queue.popleft())   # Asha (first in, first out)
print(queue.popleft())   # Ravi
print(queue)             # deque(['Meera'])`,
      after: "Queues are the right tool whenever work should be handled in the order it arrived.",
    },
    {
      title: "Hash Tables: Dicts and Sets",
      body: "Dicts and sets are hash tables: they turn each key into a number that points straight to where it's stored. That makes lookups, inserts, and membership checks O(1) on average, instead of O(n) for a list.",
      code: `ages = {"Asha": 21, "Ravi": 19}
ages["Meera"] = 22            # insert: O(1) on average
print(ages["Ravi"])           # lookup: O(1) on average

seen = set()
for n in [3, 8, 3, 5, 8]:
    if n in seen:             # membership: O(1) on average
        print("repeat:", n)   # repeat: 3, then repeat: 8
    seen.add(n)`,
      after: "Reach for a set or dict whenever you keep asking \"have I seen this before?\"",
    },
    {
      title: "Linked Lists",
      body: "A linked list is a chain of nodes, where each node holds a value and a reference to the next one. Adding at the front is O(1), but reaching the nth item means walking the chain, which is O(n).",
      code: `class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

# Build 1 -> 2 -> 3
head = Node(1, Node(2, Node(3)))
head = Node(0, head)        # add to the front: O(1)

current = head
while current:              # walk the list: O(n)
    print(current.value)    # 0, 1, 2, 3
    current = current.next`,
      after: "You'll rarely hand-build linked lists in Python, but they're the basis for many other structures.",
    },
    {
      title: "Recursion",
      body: "A recursive function solves a problem by calling itself on a smaller version of it. Every recursive function needs a base case that stops the calls, or Python eventually raises a RecursionError.",
      code: `def factorial(n):
    if n <= 1:                     # base case: stop here
        return 1
    return n * factorial(n - 1)    # recursive case

print(factorial(5))   # 120

def sum_list(nums):
    if not nums:
        return 0
    return nums[0] + sum_list(nums[1:])

print(sum_list([4, 5, 6]))  # 15`,
      after: "Python limits recursion to about 1,000 calls deep by default, so very deep problems are better written as loops.",
    },
    {
      title: "Bubble and Selection Sort",
      body: "Bubble sort repeatedly swaps neighbors that are out of order, and selection sort repeatedly picks the smallest remaining item and moves it to the front. Both use nested loops, so both are O(n^2).",
      code: `def selection_sort(nums):
    nums = nums[:]                      # work on a copy
    for i in range(len(nums)):
        smallest = i
        for j in range(i + 1, len(nums)):
            if nums[j] < nums[smallest]:
                smallest = j
        nums[i], nums[smallest] = nums[smallest], nums[i]
    return nums

print(selection_sort([29, 10, 14, 37, 13]))
# [10, 13, 14, 29, 37]`,
      after: "In real code use sorted() or list.sort(), which run in O(n log n).",
    },
    {
      title: "Merge Sort",
      body: "Merge sort splits the list in half, sorts each half recursively, then merges the two sorted halves back together. There are about log n levels of splitting and each level does O(n) merging work, so it's O(n log n).",
      code: `def merge_sort(nums):
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    left, right = merge_sort(nums[:mid]), merge_sort(nums[mid:])
    merged, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    return merged + left[i:] + right[j:]

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))  # [3, 9, 10, 27, 38, 43, 82]`,
      after: "Merge sort is always O(n log n), but it needs extra memory to hold the merged lists.",
    },
    {
      title: "Quicksort",
      body: "Quicksort picks a pivot, splits the other items into those smaller and larger than it, then sorts each side recursively. It averages O(n log n), but consistently bad pivots can make it O(n^2).",
      code: `def quicksort(nums):
    if len(nums) <= 1:
        return nums
    pivot = nums[len(nums) // 2]
    smaller = [n for n in nums if n < pivot]
    equal = [n for n in nums if n == pivot]
    larger = [n for n in nums if n > pivot]
    return quicksort(smaller) + equal + quicksort(larger)

print(quicksort([33, 10, 55, 71, 29, 3, 18]))
# [3, 10, 18, 29, 33, 55, 71]`,
      after: "Choosing the middle or a random item as the pivot helps avoid the worst case on already-sorted data.",
    },
    {
      title: "Two Pointers",
      body: "The two-pointer technique uses two indexes that move through a list, often from both ends toward the middle. On sorted data it can replace an O(n^2) nested loop with a single O(n) pass.",
      code: `def pair_with_sum(nums, target):
    left, right = 0, len(nums) - 1     # nums must be sorted
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return nums[left], nums[right]
        elif total < target:
            left += 1      # need a bigger sum
        else:
            right -= 1     # need a smaller sum
    return None

print(pair_with_sum([1, 3, 4, 6, 8, 11], 10))  # (4, 6)`,
      after: "Two pointers also work for reversing a list in place or checking whether a word is a palindrome.",
    },
    {
      title: "Sliding Window",
      body: "A sliding window tracks a run of consecutive items and updates it as it moves, instead of recomputing from scratch. Adding the new item and removing the old one turns an O(n * k) problem into O(n).",
      code: `def max_window_sum(nums, k):
    window = sum(nums[:k])              # first window
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]  # slide right by one
        best = max(best, window)
    return best

sales = [2, 1, 5, 1, 3, 2]
print(max_window_sum(sales, 3))  # 9 (5 + 1 + 3)`,
      after: "Look for a sliding window whenever a problem asks about the best consecutive run, substring, or subarray.",
    },
    {
      title: "Trees and Binary Search Trees",
      body: "A tree is made of nodes that point to child nodes, starting from a single root. In a binary search tree, smaller values go to the left and larger values go to the right, so search and insert take O(log n) when the tree is balanced.",
      code: `class TreeNode:
    def __init__(self, value):
        self.value, self.left, self.right = value, None, None

def insert(node, value):
    if node is None:
        return TreeNode(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node

root = None
for n in [50, 30, 70, 20, 40]:
    root = insert(root, n)
print(root.value, root.left.value, root.right.value)  # 50 30 70`,
      after: "Inserting already-sorted values makes a BST lopsided like a linked list, so its operations drop to O(n).",
    },
    {
      title: "Tree Traversal: DFS and BFS",
      body: "Depth-first search (DFS) goes as deep as possible down one branch before backing up, and is naturally written with recursion. Breadth-first search (BFS) visits the tree level by level using a queue. Both visit every node once, so they're O(n).",
      code: `from collections import deque

def inorder(node):                      # DFS
    if node is None:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)

def bfs(root):
    order, queue = [], deque([root])
    while queue:
        node = queue.popleft()
        order.append(node.value)
        queue.extend(c for c in (node.left, node.right) if c)
    return order

print(inorder(root))  # [20, 30, 40, 50, 70]  (BST from last lesson)
print(bfs(root))      # [50, 30, 70, 20, 40]`,
      after: "An in-order DFS of a binary search tree gives its values in sorted order.",
    },
    {
      title: "Graphs: BFS and DFS",
      body: "A graph is a set of nodes connected by edges, like cities and roads, and is often stored as a dict of neighbor lists. BFS and DFS work on graphs just like on trees, but you must track visited nodes because graphs can have cycles. Both run in O(V + E), where V is the number of nodes and E the number of edges.",
      code: `from collections import deque

graph = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"],
         "D": ["B", "C", "E"], "E": ["D"]}

def bfs(start):
    visited, queue, order = {start}, deque([start]), []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

print(bfs("A"))   # ['A', 'B', 'C', 'D', 'E']`,
      after: "BFS finds the route with the fewest edges in an unweighted graph, which makes it ideal for shortest-path puzzles.",
    },
    {
      title: "Heaps and Priority Queues",
      body: "A heap keeps the smallest item at the front so you can always grab it quickly. Python's heapq module turns a plain list into a min-heap: pushing and popping are O(log n), and peeking at the smallest is O(1).",
      code: `import heapq

tasks = []
heapq.heappush(tasks, (3, "write report"))
heapq.heappush(tasks, (1, "fix bug"))
heapq.heappush(tasks, (2, "reply to email"))

print(tasks[0])               # (1, 'fix bug')  peek at the smallest
print(heapq.heappop(tasks))   # (1, 'fix bug')
print(heapq.heappop(tasks))   # (2, 'reply to email')

scores = [42, 17, 88, 63, 95, 5]
print(heapq.nlargest(3, scores))  # [95, 88, 63]`,
      after: "Store (priority, item) tuples to build a priority queue, and negate numbers if you need a max-heap.",
    },
  ],
  quizzes: [
    {
      id: "complexity-and-searching",
      title: "Complexity and Searching",
      description: "Lessons 1–6: Big O, common complexities, lists, searching, and stacks.",
      questions: [
        { id: "q1", prompt: "What does Big O notation describe?", options: [{ id: "a", text: "The exact number of seconds a program takes" }, { id: "b", text: "How the number of steps grows as the input gets bigger" }, { id: "c", text: "How many lines of code a function has" }, { id: "d", text: "How much a computer's processor costs" }], correct: "b", explanation: "Big O describes growth in work as input size increases, ignoring constants." },
        { id: "q2", prompt: "A loop that checks each item of an n-item list once is which complexity?", options: [{ id: "a", text: "O(1)" }, { id: "b", text: "O(log n)" }, { id: "c", text: "O(n^2)" }, { id: "d", text: "O(n)" }], correct: "d", explanation: "One step per item means the work grows in a straight line with n." },
        { id: "q3", prompt: "What complexity do two nested loops over the same list usually have?", options: [{ id: "a", text: "O(log n)" }, { id: "b", text: "O(n)" }, { id: "c", text: "O(n^2)" }, { id: "d", text: "O(1)" }], correct: "c", explanation: "For each of the n items the inner loop runs up to n times, giving O(n^2)." },
        { id: "q4", prompt: "Which of these list operations is O(n)?", options: [{ id: "a", text: "nums.insert(0, 5)" }, { id: "b", text: "nums[2]" }, { id: "c", text: "nums.append(5)" }, { id: "d", text: "nums.pop()" }], correct: "a", explanation: "Inserting at the front forces every other item to shift one place right." },
        { id: "q5", prompt: "What is the worst-case time of linear search on n items?", options: [{ id: "a", text: "O(1)" }, { id: "b", text: "O(n)" }, { id: "c", text: "O(log n)" }, { id: "d", text: "O(n log n)" }], correct: "b", explanation: "If the target is last or missing, linear search checks every item." },
        { id: "q6", prompt: "What must be true of a list before you can use binary search on it?", options: [{ id: "a", text: "It must have no duplicates" }, { id: "b", text: "It must have an even length" }, { id: "c", text: "It must be sorted" }, { id: "d", text: "It must contain only numbers" }], correct: "c", explanation: "Binary search relies on sorted order to know which half to throw away." },
        { id: "q7", prompt: "About how many steps does binary search need for 1,000,000 sorted items?", options: [{ id: "a", text: "About 20" }, { id: "b", text: "About 1,000" }, { id: "c", text: "About 500,000" }, { id: "d", text: "About 1,000,000" }], correct: "a", explanation: "Halving a million items about 20 times gets down to one, since binary search is O(log n)." },
        { id: "q8", prompt: "In what order does a stack remove items?", options: [{ id: "a", text: "First in, first out" }, { id: "b", text: "Smallest item first" }, { id: "c", text: "Random order" }, { id: "d", text: "Last in, first out" }], correct: "d", explanation: "A stack's pop() always removes the most recently pushed item." },
      ],
    },
    {
      id: "structures-and-sorting",
      title: "Structures and Sorting",
      description: "Lessons 7–13: queues, hash tables, linked lists, recursion, and sorting.",
      questions: [
        { id: "q1", prompt: "Why use collections.deque instead of a list for a queue?", options: [{ id: "a", text: "Its popleft() is O(1), while list.pop(0) is O(n)" }, { id: "b", text: "It keeps items sorted automatically" }, { id: "c", text: "It is the only structure that can hold strings" }, { id: "d", text: "It can't be changed after creation" }], correct: "a", explanation: "Removing from the front of a list shifts every item, but a deque does it in constant time." },
        { id: "q2", prompt: "What is the average time for checking x in my_set?", options: [{ id: "a", text: "O(n)" }, { id: "b", text: "O(1)" }, { id: "c", text: "O(n^2)" }, { id: "d", text: "O(n log n)" }], correct: "b", explanation: "Sets are hash tables, so membership checks jump straight to where the value would be stored." },
        { id: "q3", prompt: "What does each node in a linked list hold?", options: [{ id: "a", text: "Only a value" }, { id: "b", text: "An index and a value" }, { id: "c", text: "A copy of the whole list" }, { id: "d", text: "A value and a reference to the next node" }], correct: "d", explanation: "Each node stores its value plus a link to the node after it." },
        { id: "q4", prompt: "How long does it take to reach the nth item of a linked list?", options: [{ id: "a", text: "O(1)" }, { id: "b", text: "O(log n)" }, { id: "c", text: "O(n)" }, { id: "d", text: "O(n^2)" }], correct: "c", explanation: "You have to walk the chain node by node from the head." },
        { id: "q5", prompt: "What stops a recursive function from calling itself forever?", options: [{ id: "a", text: "A base case" }, { id: "b", text: "A while loop" }, { id: "c", text: "A global variable" }, { id: "d", text: "Returning None at the start" }], correct: "a", explanation: "The base case returns without making another recursive call." },
        { id: "q6", prompt: "What is the time complexity of selection sort?", options: [{ id: "a", text: "O(n)" }, { id: "b", text: "O(log n)" }, { id: "c", text: "O(n log n)" }, { id: "d", text: "O(n^2)" }], correct: "d", explanation: "Selection sort uses a loop inside a loop, so it is O(n^2)." },
        { id: "q7", prompt: "What is the time complexity of merge sort?", options: [{ id: "a", text: "O(n^2)" }, { id: "b", text: "O(n log n)" }, { id: "c", text: "O(n)" }, { id: "d", text: "O(log n)" }], correct: "b", explanation: "There are about log n levels of splitting, and each level does O(n) merging work." },
        { id: "q8", prompt: "What can make quicksort slow down to O(n^2)?", options: [{ id: "a", text: "Using recursion" }, { id: "b", text: "A list with an odd length" }, { id: "c", text: "Consistently picking bad pivots" }, { id: "d", text: "Sorting negative numbers" }], correct: "c", explanation: "Bad pivots split the list very unevenly, so the recursion goes n levels deep." },
      ],
    },
    {
      id: "patterns-trees-and-graphs",
      title: "Patterns, Trees, and Graphs",
      description: "Lessons 14–19: two pointers, sliding windows, trees, graphs, and heaps.",
      questions: [
        { id: "q1", prompt: "In the two-pointer pair-sum search on a sorted list, what do you do when the sum is too small?", options: [{ id: "a", text: "Move the right pointer left" }, { id: "b", text: "Move the left pointer right" }, { id: "c", text: "Reset both pointers to the start" }, { id: "d", text: "Swap the two items" }], correct: "b", explanation: "Moving the left pointer right picks a larger number, which raises the sum." },
        { id: "q2", prompt: "What makes the sliding window technique fast?", options: [{ id: "a", text: "It sorts the list first" }, { id: "b", text: "It only works on strings" }, { id: "c", text: "It splits the list in half recursively" }, { id: "d", text: "It adds the new item and removes the old one instead of recomputing each window" }], correct: "d", explanation: "Updating the window in one step turns an O(n * k) approach into O(n)." },
        { id: "q3", prompt: "In a binary search tree, where do values smaller than a node go?", options: [{ id: "a", text: "Into its left subtree" }, { id: "b", text: "Into its right subtree" }, { id: "c", text: "Back to the root" }, { id: "d", text: "Into a separate list" }], correct: "a", explanation: "BSTs keep smaller values on the left and larger values on the right." },
        { id: "q4", prompt: "What happens if you insert already-sorted values into a plain BST?", options: [{ id: "a", text: "It stays perfectly balanced" }, { id: "b", text: "It raises an error" }, { id: "c", text: "It becomes lopsided like a linked list, so operations become O(n)" }, { id: "d", text: "It stores them in reverse order" }], correct: "c", explanation: "Each new value goes to the same side, so the tree becomes one long chain." },
        { id: "q5", prompt: "Which structure does BFS use to visit nodes level by level?", options: [{ id: "a", text: "A queue" }, { id: "b", text: "A stack" }, { id: "c", text: "A heap" }, { id: "d", text: "A sorted list" }], correct: "a", explanation: "A queue hands back nodes in the order they were found, which is level by level." },
        { id: "q6", prompt: "What does an in-order DFS of a binary search tree produce?", options: [{ id: "a", text: "The values in reverse order" }, { id: "b", text: "The values level by level" }, { id: "c", text: "The values in random order" }, { id: "d", text: "The values in sorted order" }], correct: "d", explanation: "Visiting left, then the node, then right lists a BST's values from smallest to largest." },
        { id: "q7", prompt: "Why does BFS on a graph need to track visited nodes?", options: [{ id: "a", text: "To sort the nodes alphabetically" }, { id: "b", text: "Graphs can have cycles, so nodes could be visited again and again" }, { id: "c", text: "To count the number of edges" }, { id: "d", text: "Because deque requires it" }], correct: "b", explanation: "Without a visited set, a cycle would send the search around the same nodes forever." },
        { id: "q8", prompt: "What does heapq.heappop() return?", options: [{ id: "a", text: "The largest item" }, { id: "b", text: "The most recently pushed item" }, { id: "c", text: "The smallest item" }, { id: "d", text: "The first item that was pushed" }], correct: "c", explanation: "heapq is a min-heap, so heappop() always removes and returns the smallest item." },
      ],
    },
  ],
};

export default dataStructuresAndAlgorithms;
