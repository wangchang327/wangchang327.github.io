+++
title = "Example post"
date = 2026-09-12
lastmod = 2026-09-13
draft = false
description = "A draft reference for post formatting, mathematics, and shortcodes."
tags = ["examples", "math", "code"]
categories = ["Examples"]
toc = true
math = true
+++

This draft brings the blog's formatting and shortcodes together. Its source is a starting point for a new post.

## Text and links

Use **bold** for emphasis, *italics* for a softer emphasis, and ~~strikethrough~~ for a correction. Chinese text uses the CJK font: 数学与计算机科学。

An [internal link]({{< relref "/miscellaneous" >}}) stays in the same tab. An [external Markdown link](https://en.wikipedia.org/wiki/Triangular_number) opens in a new tab, as does the {{< extlink "https://en.wikipedia.org/wiki/Pythagorean_theorem" "external-link shortcode" >}}. A [local download](/assets/public-key-chang.txt) stays on this site.

> A short quotation can stand apart from the surrounding discussion.

A footnote keeps an aside close without interrupting a sentence.[^example]

### Lists

1. State the question.
2. Work through a small example.
3. Check the conclusion.

Keep related questions together:

- Which assumptions matter?
    - What happens when one is removed?
- Does the smallest case behave as expected?

Tasks can be marked as they are completed:

- [x] Check the first case.
- [ ] Write the general argument.

## Mathematics

Inline mathematics works with both $S_n$ and \(n \geq 1\). Display equations can use dollar delimiters:

$$
S_n = \sum_{k=1}^{n} k = \frac{n(n+1)}{2}.
$$

### Theorems and proofs

{{< theorem title="Sum of the first integers" id="sum" >}}
For every positive integer $n$, the sum $1+2+\cdots+n$ equals $n(n+1)/2$.
{{< /theorem >}}

{{< proof >}}
Write the sum in opposite orders:

\[
\begin{aligned}
S_n &= 1 + 2 + \cdots + n, \\
S_n &= n + (n-1) + \cdots + 1.
\end{aligned}
\]

Each of the $n$ pairs adds up to $n+1$, so $2S_n=n(n+1)$.
{{< /proof >}}

The proof can be collapsed by selecting its heading. The theorem's `id` gives it a stable [link](#sum).

#### Other statements

{{< theorem kind="Lemma" title="Consecutive squares" id="squares" >}}
For every positive integer $n$, the difference $n^2-(n-1)^2$ equals $2n-1$.
{{< /theorem >}}

{{< proof title="Proof of the lemma" >}}
Expanding the square gives $n^2-(n^2-2n+1)=2n-1$.
{{< /proof >}}

The `kind` parameter also accepts names such as Proposition or Definition. Use `title` for a statement's name and `id` when it needs a [cross-reference](#squares).

## Images and tables

Images can live beside `index.md` or under `static/assets/images/`. This example uses the static images folder; the figure shortcode adds a caption and alternative text:

{{< figure src="/assets/images/example-triangle.svg" alt="A right triangle with perpendicular legs a and b and hypotenuse c." caption="The small square marks the right angle. Here, a² + b² = c²." >}}

Ordinary Markdown images also work:

![A right triangle with perpendicular legs a and b and hypotenuse c.](/assets/images/example-triangle.svg)

| Number of terms | Sum written out | Total |
| :-- | :-- | --: |
| 1 | 1 | 1 |
| 2 | 1 + 2 | 3 |
| 3 | 1 + 2 + 3 | 6 |
| 4 | 1 + 2 + 3 + 4 | 10 |
| 5 | 1 + 2 + 3 + 4 + 5 | 15 |

Tables adapt to narrow screens. The values here agree with the [sum formula](#sum), though checking examples alone does not prove it.

## Code

Inline code, such as `triangular(4)`, uses the same font as fenced code blocks:

```python
def triangular(n):
    return n * (n + 1) // 2


print([triangular(n) for n in range(1, 6)])
```

The output is <samp>[1, 3, 6, 10, 15]</samp>. HTML keyboard markup, such as <kbd>Ctrl</kbd> + <kbd>C</kbd>, uses that font too.

## Navigation

The contents list includes headings at levels two through four. Categories, tags, dates, and reading time appear above it. The arrow in the lower corner returns to the top after scrolling.

Published posts appear in the Index, with five posts per page and previous/next links between posts. This example stays unpublished while `draft = true`.

[^example]: A footnote includes a return link to the sentence where it was cited.
