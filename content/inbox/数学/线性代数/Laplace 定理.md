标签: [[数学]] [[线性代数]] [[行列式]] [[公式]]

# k阶子式和余子式

在 $n$ 阶行列式 $|A|$ 中，任意取定 $k$ 行 $k$ 列 $(1 \leq k < n)$，记为第 $i_1, \ldots, i_k$ 行和第 $j_1, \ldots, j_k$ 列。位于这些行和列交叉处的 $k^2$ 个元素构成的 $k$ 阶行列式称为 $|A|$ 的一个 **$k$ 阶子式**，记为：$A \begin{pmatrix} i_1 & \cdots & i_k \\ j_1 & \cdots & j_k \end{pmatrix}$

划去子式所在的 $k$ 行和 $k$ 列后，剩余元素构成的 $n-k$ 阶行列式称为该 $k$ 阶子式的**余子式**，记为：$A \begin{pmatrix} i_1' & \cdots & i_{n-k}' \\ j_1' & \cdots & j_{n-k}' \end{pmatrix}$

余子式乘以符号因子 $(-1)^{s}$ 所得的值称为该 $k$ 阶子式的**代数余子式**，其中：

$s = (i_1 + \cdots + i_k) + (j_1 + \cdots + j_k)$

即符号因子由子式所在行号之和与列号之和决定。

# 定理

在 $n$ 阶行列式 $|A|$ 中：

取定 $k$ 行：第 $i_1, i_2, \ldots, i_k$ 行（满足 $1 \leq i_1 < i_2 < \cdots < i_k \leq n$ 且 $1 \leq k < n$），则：

$|A| = \sum\limits_{1 \leq j_1 < j_2 < \cdots < j_k \leq n} A \begin{pmatrix} i_1 & \cdots & i_k \\ j_1 & \cdots & j_k \end{pmatrix} \cdot (-1)^{s} A \begin{pmatrix} i_1' & \cdots & i_{n-k}' \\ j_1' & \cdots & j_{n-k}' \end{pmatrix}$

取定 $k$ 列：第 $j_1, j_2, \ldots, j_k$ 列（满足 $1 \leq j_1 < j_2 < \cdots < j_k \leq n$ 且 $1 \leq k < n$），则：

$|A| = \sum\limits_{1 \leq i_1 < i_2 < \cdots < i_k \leq n} A \begin{pmatrix} i_1 & \cdots & i_k \\ j_1 & \cdots & j_k \end{pmatrix} \cdot (-1)^{s} A \begin{pmatrix} i_1' & \cdots & i_{n-k}' \\ j_1' & \cdots & j_{n-k}' \end{pmatrix}$

