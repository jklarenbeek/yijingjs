# Yijing Explorer

> A modern, interactive exploration of the I Ching (Yijing) through mathematical, computational, and philosophical lenses

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://jklarenbeek.github.io/yijingjs/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 What is Yijing Explorer?

Yijing Explorer is an interactive web application that reimagines the ancient Chinese divination system of the I Ching (Yijing) through modern computational and mathematical frameworks. It transforms the 64 hexagrams from static symbols into dynamic, interconnected nodes in a multidimensional exploration space.

This project bridges ancient wisdom with modern technology, offering:

- **Mathematical Foundations**: Hexagrams as 6-bit binary numbers (0-63)
- **Interactive Visualization**: Real-time exploration of hexagram relationships
- **Multiple Sequencing Systems**: Traditional King Wen, Early/Later Heaven, and mathematical sequences like Gray Code
- **Genetic Mapping**: Direct correlation between hexagrams and genetic codons
- **Custom Sequence Creation**: Build and save your own hexagram arrangements

## 🎯 Live Demo

**[Explore the Yijing Explorer Live!](https://jklarenbeek.github.io/yijingjs/)**

Experience the full interactive application with all features available in your browser.

## 🔬 Key Features

### Interactive Hexagram Grid
- **Multiple Views**: Switch between trigram (3-line symbol) and sixiang (2-line symbol) representations
- **Real-time Filtering**: Filter by symmetry groups, elemental transitions, mantra levels, and more
- **Visual Relationships**: See neighboring hexagrams and transformation paths
- **Keyboard Navigation**: Navigate the grid with arrow keys

### Mathematical Frameworks

#### Binary Representation
Each hexagram is represented as a 6-bit binary number:
- **Top line** = bit 0 (LSB)
- **Bottom line** = bit 5 (MSB)

This consistent representation applies to:
- **Hexagrams**: 6 lines = 6 bits (0-63)
- **Trigrams**: 3 lines = 3 bits (0-7)
- **Sixiangs**: 2 lines = 2 bits (0-3)

#### Multiple Sequencing Systems
- **King Wen Sequence**: Traditional divination order
- **Early Heaven Sequence**: Cosmic arrangement
- **Later Heaven Sequence**: Temporal arrangement
- **Gray Code Sequence**: Mathematical sequence where adjacent values differ by exactly one bit
- **Binary Sequence**: Natural counting order

### Advanced Analysis Tools

#### Symmetry Classification
Hexagrams are categorized into 7 symmetry groups:
- **Breath**, **Mother**, **Direction** (balanced)
- **Beginning**, **Principle**, **Titan**, **Gigante** (unbalanced)

#### Elemental Transitions
Wuxing (Five Element) analysis between upper and lower trigrams:
- **Creates** (generative cycle)
- **Destroys** (controlling cycle)
- **Weakens** (reverse generative)
- **Insults** (reverse controlling)
- **Neutral** (same element)

#### Genetic Mapping
Direct correlation to the genetic code:
- Each hexagram maps to a 3-base codon
- Shows corresponding amino acids
- Stop codon identification
- Dyadic mutation simulation

### Custom Sequence Editor
- **Drag & Drop Interface**: Build custom hexagram arrangements
- **Undo/Redo Support**: Complete edit history
- **Save & Load**: Persistent custom sequences
- **Real-time Validation**: Visual feedback and constraints

## 🧠 Philosophical & Mathematical Depth

### Computational Taoism
The project implements several innovative frameworks:

#### Three-Layer Architecture (Deus/Homo/Torah)
- **Deus** (Red): Top two lines - spiritual dimension
- **Homo** (White): Middle two lines - human dimension
- **Torah** (Blue): Bottom two lines - foundational dimension

#### Nuclear Convergence
- Every hexagram converges to one of 4 cosmic roots through center operations
- **Cosmic** (4 hexagrams): Primordial states
- **Karmic** (12 hexagrams): Direct descendants of cosmic
- **Atomic** (48 hexagrams): Further descendants

#### Entropy & Balance Metrics
- **Information Entropy**: Measures balance/chaos (0 = pure, 1 = perfect balance)
- **Yang Balance Ratio**: Proportion of yang lines (0.0 - 1.0)
- **Transformation Distance**: Hamming distance between hexagrams

## 🚀 Why Use Yijing Explorer?

### For I Ching Practitioners
- **Modern Interface**: Move beyond static book interpretations
- **Relationship Mapping**: Visualize how hexagrams transform into each other
- **Multiple Perspectives**: Switch between traditional and mathematical views
- **Personal Sequences**: Create and save meaningful arrangements

### For Mathematicians & Computer Scientists
- **Group Theory**: Explore the symmetric group S₆₄ and its subgroups
- **Information Theory**: Study entropy and information content
- **Graph Theory**: Hexagrams as nodes in a 6-dimensional hypercube
- **Genetic Algorithms**: Understand the mathematical structure of the genetic code

### For Philosophers & Spiritual Seekers
- **Pattern Recognition**: Discover deeper symbolic relationships
- **Meditative Tool**: Use custom sequences for contemplation
- **Cross-cultural Bridge**: Connect ancient Chinese wisdom with modern science
- **Personal Insight**: Interactive exploration of life situations and transformations

## 🛠 Technical Implementation

Built with modern web technologies:
- **React 19** with hooks for state management
- **Custom mathematical libraries** for Yijing operations
- **Tailwind CSS** for responsive design
- **Local storage** for sequence persistence
- **Modular architecture** for extensibility

## 📚 Learning Resources

The project includes comprehensive documentation within the code:
- Mathematical proofs of symmetry classifications
- Genetic code mapping tables
- Transformation operation definitions
- Philosophical framework explanations

## 🔮 Future Development

### Geno-logic coding

The implementation of numeric connection between the I-Ching, binary numbers, and the geno-logic code suggests the genetic code has an underlying mathematical structure, akin to systems used in computing, with the I-Ching acting as an ancient template for this structure. Researchers propose that the 64 hexagrams of the I-Ching correspond to the 64 mRNA codons and the 4 DNA bases form a system based on binary oppositions, which can be described using dyadic groups and binary-logic rules. This framework, called "geno-logic coding," is seen as a parallel system to the well-known amino acid genetic code, encoding inherited processes through Boolean functions.

### The I-Ching and binary representation

The I-Ching uses a system of yin (broken line, 0) and yang (unbroken line, 1) to form 8 trigrams and 64 hexagrams, which were considered fundamental archetypes of nature.
This system is inherently based on binary groupings, with the 8 trigrams being groups of 3 binary numbers and the 64 hexagrams being groups of 6 binary numbers.
This ancient system can be seen as an early example of representing information through combinations of two basic states, a concept that mirrors modern digital and binary systems.

### Dyadic groups and the genetic code

The genetic code uses four nitrogenous bases (A, T, C, G) to create codons, which are groups of three bases.
Researchers have identified binary-oppositional traits within these bases, such as purines vs. pyrimidines and keto vs. amino groups, to create binary "sub-alphabets".
These binary representations are based on dyadic (two-fold) shifts and groups, which are mathematical concepts also used in digital communication and computing.
Studies suggest a strong correlation between the structure of the 64 codons and the 64 hexagrams of the I-Ching, with a mathematical and logical harmony underlying both systems.
Geno-logic coding and its relation to the genetic code
Geno-logic coding is a proposed system that runs in parallel with the standard genetic code for amino acids.
It uses the binary representation of DNA sequences to encode inherited algorithmic processes, rather than the proteins themselves.
This is based on the concept of Boolean functions and logical holography, which are principles from computer science.
One key aspect is the use of modulo-2 addition, where the sum of any two of the three parallel binary representations of a DNA sequence equals the third one, a concept that has analogies with the structure of the I-Ching and mathematical codes.

Potential extensions include:
- Mobile application
- API for developers
- Advanced visualization modes
- Community sequence sharing
- Historical sequence analysis

## 🎓 Getting Started

### For Users
Visit the [live demo](https://jklarenbeek.github.io/yijingjs/) to start exploring immediately.

### For Developers
```bash
git clone https://github.com/jklarenbeek/yijingjs.git
cd yijingjs
npm install
npm run dev
```

## Installation
```bash
npm install @yijingjs/core
```

## Usage
```javascript
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

// Get hexagram properties
const hex = 21;
const upper = Yijing.yijing_upper(hex);
const lower = Yijing.yijing_lower(hex);
const lineCount = Yijing.yijing_lineCount(hex);

// Get symmetry classification
const symmetry = Yijing.yijing_symmetryName(hex);

// Get neighbors (single-bit changes)
const neighbors = Yijing.yijing_neighbors(hex);

// Get wuxing element for trigram
const element = Bagua.bagua_toWuxing(upper);
const emoji = Wuxing.wuxing_toEmojiChar(element);
```

## 📜 License

MIT License - feel free to use this project for personal, educational, or commercial purposes.

---

**Yijing Explorer** transforms ancient divination into a modern tool for pattern recognition, mathematical exploration, and personal insight. Whether you're studying the I Ching, exploring mathematical symmetry, or seeking personal guidance, this project offers a unique bridge between ancient wisdom and modern computational thinking.

*"The patterns of change are universal - from the shifting lines of the I Ching to the binary code of modern computation."*
