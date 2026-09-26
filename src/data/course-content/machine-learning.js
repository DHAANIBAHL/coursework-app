const machineLearning = {
  slug: "machine-learning",
  tag: "Frontend",
  title: "Machine Learning",
  image: "/images/Machine Learning.png",
  color: "bg-blue-500",
  description: "The math behind gradient descent, the models you'll train daily, and why your loss curve does what it does.",
  lessons: [
    {
      title: "What Machine Learning Is",
      body: "Machine learning is a way of building programs that learn patterns from data instead of following hand-written rules. You show the model examples, and it adjusts itself to make better predictions.",
      code: `Traditional programming:
  rules + data  -> answers

Machine learning:
  data + answers -> rules (the model)

Then: new data + model -> predictions`,
      after: "The model is only as good as the examples you give it.",
    },
    {
      title: "Features and Labels",
      body: "Features are the inputs a model uses, like a house's size and location. The label is the answer you want it to predict, like the price.",
      code: `import pandas as pd

df = pd.DataFrame({
    "size_sqft": [850, 1200, 1500],
    "bedrooms":  [2, 3, 3],
    "price":     [45, 68, 80],   # in lakhs
})

X = df[["size_sqft", "bedrooms"]]  # features
y = df["price"]                    # label`,
      after: "By convention, X holds the features and y holds the label.",
    },
    {
      title: "Cleaning and Preparing Data",
      body: "Real data has gaps, typos, and duplicate rows, and most models can't handle missing values at all. Cleaning means finding these problems and fixing or removing them before training.",
      code: `import pandas as pd

df = pd.DataFrame({
    "size_sqft": [850, None, 1500, 1500],
    "bedrooms":  [2, 3, 3, 3],
    "price":     [45, 68, 80, 80],
})

df = df.drop_duplicates()          # remove repeated rows
print(df.isna().sum())             # count missing values per column

median = df["size_sqft"].median()
df["size_sqft"] = df["size_sqft"].fillna(median)`,
      after: "Always look at your data before modeling; a few bad rows can quietly ruin a model.",
    },
    {
      title: "Train and Test Splits",
      body: "You judge a model on data it hasn't seen during training. Splitting your data keeps some aside for an honest test.",
      code: `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(len(X_train), len(X_test))`,
      after: "Testing on training data is like grading students on questions they already saw the answers to.",
    },
    {
      title: "Feature Scaling",
      body: "Features often live on very different scales, like square feet in the thousands and bedrooms under ten. Scaling puts them on a similar range so no feature dominates just because its numbers are bigger.",
      code: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

# learn the mean and spread from training data only
X_train_scaled = scaler.fit_transform(X_train)

# reuse those same numbers on the test data
X_test_scaled = scaler.transform(X_test)

print(X_train_scaled.mean(axis=0))  # close to 0
print(X_train_scaled.std(axis=0))   # close to 1`,
      after: "Fit the scaler on training data only, or information from the test set leaks into training.",
    },
    {
      title: "Linear Regression",
      body: "Linear regression predicts a number by fitting a straight line through the data. Training finds the slope and intercept that fit best.",
      code: `from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)

print(model.coef_)       # slope for each feature
print(model.intercept_)  # where the line starts
print(model.predict([[1000, 2]]))`,
      after: "Each coefficient tells you how much the prediction changes when that feature goes up by one.",
    },
    {
      title: "Loss Functions",
      body: "A loss function measures how wrong the model's predictions are. Mean squared error squares each mistake, so big mistakes count much more than small ones.",
      code: `import numpy as np

y_true = np.array([45, 68, 80])
y_pred = np.array([50, 65, 78])

errors = y_pred - y_true      # [5, -3, -2]
mse = np.mean(errors ** 2)    # (25 + 9 + 4) / 3
print(mse)                    # 12.67`,
      after: "Training is simply the search for model settings that make the loss as small as possible.",
    },
    {
      title: "Gradient Descent",
      body: "Gradient descent lowers the loss step by step. It works out which direction makes the loss go down — the gradient — and nudges the model's weights that way.",
      code: `import numpy as np

x = np.array([1, 2, 3, 4])
y = np.array([2, 4, 6, 8])   # true rule: y = 2x
w = 0.0
lr = 0.01

for step in range(200):
    pred = w * x
    grad = np.mean(2 * (pred - y) * x)  # slope of the loss
    w -= lr * grad

print(round(w, 3))  # close to 2.0`,
      after: "Picture walking downhill in fog: you can't see the bottom, but you can feel which way is down.",
    },
    {
      title: "The Learning Rate",
      body: "The learning rate controls how big each gradient descent step is. Too small and training crawls; too large and the loss bounces around or blows up.",
      code: `for lr in [0.001, 0.01, 0.2]:
    w = 0.0
    for step in range(50):
        grad = np.mean(2 * (w * x - y) * x)
        w -= lr * grad
    print(lr, round(w, 3))

# 0.001 -> still far from 2 (too slow)
# 0.01  -> close to 2
# 0.2   -> huge number (diverged)`,
      after: "If your loss suddenly shoots up to infinity or NaN, try a smaller learning rate first.",
    },
    {
      title: "Classification with Logistic Regression",
      body: "Classification predicts a category, like spam or not spam. Logistic regression outputs a probability between 0 and 1, and anything over a threshold counts as yes.",
      code: `from sklearn.linear_model import LogisticRegression

# hours studied -> passed (1) or failed (0)
X = [[1], [2], [3], [4], [5], [6]]
y = [0, 0, 0, 1, 1, 1]

clf = LogisticRegression()
clf.fit(X, y)

print(clf.predict([[3.5]]))
print(clf.predict_proba([[3.5]]))  # [[P(fail), P(pass)]]`,
      after: "Despite the name, logistic regression is a classification model.",
    },
    {
      title: "K-Nearest Neighbors",
      body: "K-nearest neighbors classifies a new point by looking at the k closest training examples and taking a majority vote. There's no real training step; the model just remembers the data.",
      code: `from sklearn.neighbors import KNeighborsClassifier

# hours studied -> passed (1) or failed (0)
X = [[1], [2], [3], [4], [5], [6]]
y = [0, 0, 0, 1, 1, 1]

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X, y)

print(knn.predict([[4.2]]))  # neighbors 4, 5, 3 -> votes 1, 1, 0 -> [1]`,
      after: "Because KNN relies on distances, scale your features first or the biggest numbers will decide everything.",
    },
    {
      title: "Decision Trees",
      body: "A decision tree makes predictions by asking a series of yes-or-no questions about the features. It's easy to read, which makes it a good first model to explain to others.",
      code: `from sklearn.tree import DecisionTreeClassifier, export_text

tree = DecisionTreeClassifier(max_depth=2)
tree.fit(X, y)

print(export_text(tree, feature_names=["hours"]))
# |--- hours <= 3.50
# |   |--- class: 0
# |--- hours >  3.50
# |   |--- class: 1`,
      after: "max_depth limits how many questions the tree can ask, which keeps it from memorizing the data.",
    },
    {
      title: "Random Forests",
      body: "A random forest trains many decision trees, each on a random sample of the data and features, and combines their votes. Combining models like this is called an ensemble, and it's usually more accurate than any single tree.",
      code: `from sklearn.ensemble import RandomForestClassifier

forest = RandomForestClassifier(
    n_estimators=100,   # number of trees
    max_depth=3,
    random_state=42,
)
forest.fit(X, y)

print(forest.predict([[3.5]]))
print(forest.feature_importances_)  # how much each feature helped`,
      after: "When you need a strong model with little tuning, a random forest is a reliable first choice.",
    },
    {
      title: "Overfitting and Regularization",
      body: "Overfitting happens when a model memorizes its training data, including the noise, and then does badly on new data. Regularization adds a penalty for complexity to keep the model simpler.",
      code: `from sklearn.linear_model import Ridge

model = Ridge(alpha=1.0)   # higher alpha = stronger penalty
model.fit(X_train, y_train)

print("train:", model.score(X_train, y_train))
print("test: ", model.score(X_test, y_test))`,
      after: "A big gap between training and test scores is the classic sign of overfitting.",
    },
    {
      title: "Cross-Validation",
      body: "A single train/test split can be lucky or unlucky. Cross-validation splits the data into k folds, trains k times with a different fold held out each time, and averages the scores.",
      code: `from sklearn.model_selection import cross_val_score
from sklearn.linear_model import Ridge

model = Ridge(alpha=1.0)
scores = cross_val_score(model, X, y, cv=5)  # 5 folds

print(scores)          # one score per fold
print(scores.mean())   # overall estimate
print(scores.std())    # how much it varies`,
      after: "Use cross-validation to compare models or settings, since the average score is far more trustworthy than one split.",
    },
    {
      title: "Evaluating a Classifier",
      body: "Accuracy alone can mislead, especially when one class is rare. Precision asks how many predicted positives were right; recall asks how many real positives were found.",
      code: `from sklearn.metrics import accuracy_score, precision_score, recall_score

y_true = [1, 0, 1, 1, 0, 0, 1, 0]
y_pred = [1, 0, 0, 1, 0, 1, 1, 0]

print(accuracy_score(y_true, y_pred))   # 0.75
print(precision_score(y_true, y_pred))  # 0.75
print(recall_score(y_true, y_pred))     # 0.75`,
      after: "For a disease test, missing a real case is worse than a false alarm, so recall matters most.",
    },
    {
      title: "Reading a Loss Curve",
      body: "A loss curve plots the loss after each round of training. Comparing training loss with validation loss tells you whether the model is still learning, done, or overfitting.",
      code: `import matplotlib.pyplot as plt

plt.plot(train_losses, label="training")
plt.plot(val_losses, label="validation")
plt.xlabel("epoch")
plt.ylabel("loss")
plt.legend()
plt.show()

# Both falling           -> keep training
# Both flat              -> model has learned what it can
# Train falls, val rises -> overfitting, stop earlier`,
      after: "Stopping at the point where validation loss is lowest is called early stopping.",
    },
  ],
  quizzes: [
    {
      id: "ml-foundations",
      title: "ML Foundations",
      description: "Lessons 1–6: what ML is, features and labels, data cleaning, splits, scaling, and linear regression.",
      questions: [
        { id: "q1", prompt: "How does machine learning differ from traditional programming?", options: [{ id: "a", text: "It uses hand-written rules to produce answers" }, { id: "b", text: "It learns the rules from data and answers" }, { id: "c", text: "It never needs any data" }, { id: "d", text: "It only works with images" }], correct: "b", explanation: "In machine learning you supply data plus answers, and the model learns the rules." },
        { id: "q2", prompt: "In a house price model, what is the price?", options: [{ id: "a", text: "A feature" }, { id: "b", text: "A loss function" }, { id: "c", text: "The label" }, { id: "d", text: "A coefficient" }], correct: "c", explanation: "The label is the answer you want the model to predict, here the price." },
        { id: "q3", prompt: "What does df.isna().sum() tell you?", options: [{ id: "a", text: "How many missing values each column has" }, { id: "b", text: "The total of every column" }, { id: "c", text: "How many duplicate rows exist" }, { id: "d", text: "The median of each column" }], correct: "a", explanation: "isna() marks missing values and sum() counts them per column." },
        { id: "q4", prompt: "Why do you hold back a test set?", options: [{ id: "a", text: "To make training faster" }, { id: "b", text: "To have more features" }, { id: "c", text: "To remove duplicate rows" }, { id: "d", text: "To judge the model on data it hasn't seen" }], correct: "d", explanation: "A test set gives an honest measure of how the model does on new data." },
        { id: "q5", prompt: "When using StandardScaler, which data should you fit the scaler on?", options: [{ id: "a", text: "The test data only" }, { id: "b", text: "The training data only" }, { id: "c", text: "Training and test data together" }, { id: "d", text: "It doesn't need to be fit" }], correct: "b", explanation: "Fitting on training data only prevents test-set information from leaking into training." },
        { id: "q6", prompt: "Why scale features like square feet and bedroom count?", options: [{ id: "a", text: "So no feature dominates just because its numbers are bigger" }, { id: "b", text: "To remove missing values" }, { id: "c", text: "To turn regression into classification" }, { id: "d", text: "To make the dataset smaller" }], correct: "a", explanation: "Scaling puts features on a similar range so large-valued ones don't dominate." },
        { id: "q7", prompt: "What does a linear regression coefficient tell you?", options: [{ id: "a", text: "The model's accuracy" }, { id: "b", text: "The number of training rows" }, { id: "c", text: "How much the prediction changes when that feature goes up by one" }, { id: "d", text: "Where the line crosses zero on the x-axis" }], correct: "c", explanation: "Each coefficient is the slope for its feature." },
      ],
    },
    {
      id: "training-and-models",
      title: "Training and Models",
      description: "Lessons 7–12: loss, gradient descent, learning rate, logistic regression, KNN, and decision trees.",
      questions: [
        { id: "q1", prompt: "Why does mean squared error punish big mistakes more than small ones?", options: [{ id: "a", text: "It ignores small mistakes" }, { id: "b", text: "It uses absolute values" }, { id: "c", text: "It only counts the largest error" }, { id: "d", text: "It squares each error" }], correct: "d", explanation: "Squaring makes large errors grow much faster than small ones." },
        { id: "q2", prompt: "What does gradient descent do on each step?", options: [{ id: "a", text: "Nudges the weights in the direction that lowers the loss" }, { id: "b", text: "Picks random weights" }, { id: "c", text: "Adds more training data" }, { id: "d", text: "Splits the data into folds" }], correct: "a", explanation: "The gradient shows which way the loss goes down, and the weights move that way." },
        { id: "q3", prompt: "Your loss suddenly shoots up to NaN. What should you try first?", options: [{ id: "a", text: "A larger learning rate" }, { id: "b", text: "More features" }, { id: "c", text: "A smaller learning rate" }, { id: "d", text: "Removing the test set" }], correct: "c", explanation: "A learning rate that's too large makes training diverge." },
        { id: "q4", prompt: "What does logistic regression output before applying a threshold?", options: [{ id: "a", text: "A straight-line price" }, { id: "b", text: "A probability between 0 and 1" }, { id: "c", text: "A list of yes-or-no questions" }, { id: "d", text: "The mean squared error" }], correct: "b", explanation: "Logistic regression outputs a probability, and values over the threshold count as yes." },
        { id: "q5", prompt: "How does k-nearest neighbors classify a new point?", options: [{ id: "a", text: "By fitting a straight line" }, { id: "b", text: "By asking a series of yes-or-no questions" }, { id: "c", text: "By running gradient descent" }, { id: "d", text: "By a majority vote of the k closest training examples" }], correct: "d", explanation: "KNN looks at the nearest k examples and takes the most common class." },
        { id: "q6", prompt: "Why should you scale features before using KNN?", options: [{ id: "a", text: "KNN relies on distances, so large-valued features would dominate" }, { id: "b", text: "KNN cannot read decimals" }, { id: "c", text: "Scaling adds more neighbors" }, { id: "d", text: "KNN only works with a single feature" }], correct: "a", explanation: "Distances are driven by the biggest numbers unless features are on a similar scale." },
        { id: "q7", prompt: "What does max_depth control in a decision tree?", options: [{ id: "a", text: "The learning rate" }, { id: "b", text: "The number of trees" }, { id: "c", text: "How many questions the tree can ask in a row" }, { id: "d", text: "The size of the test set" }], correct: "c", explanation: "Limiting depth keeps the tree from memorizing the training data." },
      ],
    },
    {
      id: "better-models",
      title: "Building Better Models",
      description: "Lessons 13–17: random forests, overfitting, cross-validation, classifier metrics, and loss curves.",
      questions: [
        { id: "q1", prompt: "What is a random forest?", options: [{ id: "a", text: "A single very deep decision tree" }, { id: "b", text: "Many decision trees trained on random samples whose votes are combined" }, { id: "c", text: "A type of linear regression" }, { id: "d", text: "A way to clean missing data" }], correct: "b", explanation: "A random forest is an ensemble of trees that vote together." },
        { id: "q2", prompt: "What is the classic sign of overfitting?", options: [{ id: "a", text: "Low scores on both training and test data" }, { id: "b", text: "A learning rate that is too small" }, { id: "c", text: "Identical training and test scores" }, { id: "d", text: "A big gap between training and test scores" }], correct: "d", explanation: "An overfit model does well on training data but badly on new data." },
        { id: "q3", prompt: "In Ridge regression, what happens when you raise alpha?", options: [{ id: "a", text: "The penalty for complexity gets stronger" }, { id: "b", text: "The model gets more complex" }, { id: "c", text: "More trees are added" }, { id: "d", text: "The test set gets bigger" }], correct: "a", explanation: "Higher alpha means a stronger regularization penalty and a simpler model." },
        { id: "q4", prompt: "Why use cross-validation instead of a single train/test split?", options: [{ id: "a", text: "It removes the need for any test data" }, { id: "b", text: "It makes the model train faster" }, { id: "c", text: "Averaging over several folds gives a more trustworthy score" }, { id: "d", text: "It automatically scales features" }], correct: "c", explanation: "A single split can be lucky or unlucky, while an average across folds is more reliable." },
        { id: "q5", prompt: "What does recall measure?", options: [{ id: "a", text: "How many predicted positives were right" }, { id: "b", text: "How many real positives were found" }, { id: "c", text: "The overall share of correct predictions" }, { id: "d", text: "The average squared error" }], correct: "b", explanation: "Recall asks how many of the actual positives the model caught." },
        { id: "q6", prompt: "Why can accuracy alone be misleading?", options: [{ id: "a", text: "It is always lower than precision" }, { id: "b", text: "It only works for regression" }, { id: "c", text: "It ignores the training data" }, { id: "d", text: "It can look high when one class is rare" }], correct: "d", explanation: "With a rare class, a model can score high accuracy while missing most real positives." },
        { id: "q7", prompt: "On a loss curve, training loss keeps falling but validation loss starts rising. What does this mean?", options: [{ id: "a", text: "The model is overfitting, so stop earlier" }, { id: "b", text: "Keep training for many more epochs" }, { id: "c", text: "The learning rate is too small" }, { id: "d", text: "The model has learned nothing" }], correct: "a", explanation: "Rising validation loss with falling training loss signals overfitting, which early stopping addresses." },
      ],
    },
  ],
};

export default machineLearning;
