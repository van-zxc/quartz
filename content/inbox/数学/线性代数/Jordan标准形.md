标签: [[数学]] [[线性代数]] [[概念]] [[公式]] [[n维向量和矩阵]] [[线性映射]] [[矩阵变换]]

# 引入&证明---存在性

这里觉得Gemini的观察更加清晰一点. 我们不妨借用[[分块对角矩阵#分块矩阵的对角化]]的理念: 即矩阵难以被一次零化(没有一维的[[不变子空间]]), 但是不变子空间的维数可以更高. 

因此, 我们不妨假设某个向量经过多次零化后变为零向量, 即$(\sigma-\lambda_{i}I)^{k}v_{k}=0$. 因此我们可以写出如下的向量映射链
$$
\begin{align}
(\sigma-\lambda_{i}I)v_{k} & =v_{k-1} \\
(\sigma-\lambda_{i}I)v_{k-1} & =v_{k-2} \\
 & \vdots \\
(\sigma-\lambda_{i}I)v_{2} & =v_{1} \\
(\sigma-\lambda_{i}I)v_{1} & =0
\end{align}
$$
我们将该映射更改, 即变为Jordan标准形的形式. 

我们以上面的向量作为基底, 向量基底即变为以下形式
$$
B=\{ (\sigma-\lambda I)^{k}(v_{k}),\ (\sigma-\lambda I)^{k-1}(v_{k}),\ \dots,(\sigma-\lambda I)(v_{k}),\ v_{k} \}
$$
该向量组我们称为$\sigma$关于特征值$\lambda$的循环广义特征向量组. 作为基底成为Jordan循环基. 

可以证明, 该基底可以构成一个不变子空间, 在该基底下能够生成分块对角矩阵. 此外该向量组也是线性无关的(参考[[特征值和特征向量#与 不变子空间 的关系]]). 

此外我们为了引入终极定理又引入了关于之前的循环基的性质: 即循环基张成的线性空间互不相交且两两线性无关. 

于是我们就能得到: ==任意广义特征子空间都可以使用Jordan循环基表示. ==进一步的使用[[分块对角矩阵#分块矩阵的对角化]]的内容, 我们可以得到任何矩阵都可以使用这样的Jordan分块矩阵进行操作(该操作针对于复数域). 

Add: 
>[!definition] 定义
>$$
>G_{j}(\sigma,\lambda)=ker\ N^{j}
>$$

# 唯一性

我们引入[[Young图]]. 证明借助其完成

# 应用

### 如何求基? 

简单来说, 就是做差集. 我们先找到最难零化的, 即经过最多次线性映射操作后才变为零向量的向量(Young图最低端). 该(这些)向量是在$G_{j}(\sigma,\lambda)$但是不在$G_{j-1}(\sigma,\lambda)$中的. 然后利用上面的循环基, 可以求出其所在的一列的向量. 随后下一列的列尾继续. 但是要注意不能和之前求出来的同一行的向量线性相关. 

简而言之就是一个循环算法, 该算法满足: 
1. $v \in G_{j}(\sigma,\lambda)$
2. $v \notin G_{j-1}(\sigma,\lambda)$
3. 向量和同一行左边的所有向量线性无关. 

### 如何求[[不变子空间]]? 

可以求得(啊啊啊啊我懒得写证明了), 对于单个的Jordan块, 每一个Jordan循环基从下而上张成的向量都是一个不变子空间. 

即有
$$
\{ span\{ 0 \},\dots span\{ v_{1},\dots,v_{n-1},v_{n} \} \}
$$
共$n+1$个不变子空间. 且: 不变子空间的直和仍然是不变子空间. 且我们没有遗漏的, 这就是全部的不变子空间

### Jordan块的幂次计算

Jordan块性质比较优良, 又利于计算, 给了无法对角化的矩阵计算幂次的机会. 
$$
\begin{align}
J_{k}(a)^{n} & =(aE+J_{k}(0))^{n}=a^{n}E+a^{n-1}C_{n}^{1}J_{k}(0)+\dots+C_{n}^{n}J_{k}(0)^{n} \\
 & =\begin{pmatrix}
\lambda_{j}^{m} & C_{m}^{1}\lambda_{j}^{m-1} & \dots \\
0 & \lambda_{j}^{m} & \dots \\
\vdots & \vdots & \ddots
\end{pmatrix}
\end{align}
$$
当幂次趋于无穷时, 有以下结论: 
1. 当$\forall\ |\lambda_{i}|<1$时, 收敛至零矩阵. 
2. 若任意一个$|\lambda_{i}|>1$, 则不收敛. 
3. 若任意一个Jordan块不可对角化, 则不收敛
4. 若该矩阵[[可对角化]], 则可能收敛也可能振荡. 绝大多数情况振荡. 

假设$J_{n}(a)$为特征值为$a$的Jordan矩阵块, 则有如下的根式结论
1. 假设$a\neq0$, 则该Jordan矩阵必然可被$m$次开根号. 
2. 当$n\geq2$时, $J_{n}(0)$无法开根. 

### 求解[[常系数线性微分方程]]组

不妨假设$n$阶微分方程组形式为
$$
\frac{\mathrm{d}}{\mathrm{d}x^{n}}f_{1} - a_{n-1}\frac{\mathrm{d}}{\mathrm{d}x^{n-1}}f_{1} - \dots - a_{1} \frac{\mathrm{d}}{\mathrm{d}x}f_{1} = b f_{1}
$$
我们令$f_{2}=\frac{\mathrm{d}}{\mathrm{d}x}f_{1},\dots$, 于是可以改写为
$$
\frac{\mathrm{d}}{\mathrm{d}x}\begin{pmatrix}
f_{1} \\
f_{2} \\
\vdots \\
f_{n}
\end{pmatrix}
= \begin{pmatrix}
0 & 1 & 0 & \dots & 0 \\
0 & 0 & 1 & \dots & 0 \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
b & a_{1} & a_{2} & \dots & a_{n-1}
\end{pmatrix}
\begin{pmatrix}
f_{1} \\
f_{2} \\
\vdots \\
f_{n}
\end{pmatrix} = 
C\begin{pmatrix}
f_{1} \\
f_{2} \\
\vdots \\
f_{n}
\end{pmatrix} 
$$
我们不妨将其转换为Jordan标准形: $PCP^{-1}=J$, 且令
$$
P^{-1}\begin{pmatrix}
f_{1} \\
f_{2} \\
\vdots \\
f_{n}
\end{pmatrix} = 
\begin{pmatrix}
g_{1} \\
g_{2} \\
\vdots \\
g_{n}
\end{pmatrix} 
$$
则有
$$
\frac{\mathrm{d}}{\mathrm{d}x}
\begin{pmatrix}
g_{1} \\
g_{2} \\
\vdots \\
g_{n}
\end{pmatrix}
=
J\begin{pmatrix}
g_{1} \\
g_{2} \\
\vdots \\
g_{n}
\end{pmatrix}
$$
如果说是[[对角矩阵]], 则可以直接解耦. 若不是, 则可以按照各个分量展开, 挨个求, 不难. 

### 求数列通项方程

我们不妨先考虑一下简单一点的方程: 
$$
a_{n+1}=k_{1}a_{n}+k_{2}a_{n-1}\implies \begin{pmatrix}
a_{n} \\
a_{n+1}
\end{pmatrix}
=\begin{pmatrix}
0 & 1 \\
k_{2} & k_{1}
\end{pmatrix}
\begin{pmatrix}
a_{n-1} \\
a_{n}
\end{pmatrix}
\implies
\begin{pmatrix}
a_{n} \\
a_{n+1}
\end{pmatrix}
=A
\begin{pmatrix}
a_{n-1} \\
a_{n}
\end{pmatrix}
$$
我们可以求该矩阵的特征值, 有$A\mathbf{x}=\lambda \mathbf{x}$. 即有
$$
\det(A-\lambda I)=0 \implies \begin{vmatrix}
-\lambda & 1 \\
k_{2} & k_{1}-\lambda
\end{vmatrix}=0
\implies
\lambda^{2}-k_{1}\lambda-k_{2}=0
$$
就是我们之前的特征方程. 解得特征值为$\lambda_{1},\lambda_{2}$. 

在该条件下, 该特征矩阵相似的对角矩阵为$\Lambda=\begin{pmatrix}\lambda_{1}&\\&\lambda_{2}\end{pmatrix}$. 对应特征向量为$v_{1}=(1,\lambda_{1}),v_{2}=(1,\lambda_{2})$因此进行$n$次映射操作后, 映射矩阵即为$\Lambda^{n}=\begin{pmatrix}\lambda_{1}^{n}&\\&\lambda_{2}^{n}\end{pmatrix}$. 不妨假设$(a_{1},a_{2})=c_{1}v_{1}+c_{2}v_{2}$, 则$\Lambda^{n}\begin{pmatrix}c_{1}\\ c_{2}\end{pmatrix}=\begin{pmatrix}a_{n}\\ a_{n+1}\end{pmatrix}$. 可以解得$a_{n}=c_{1}\lambda_{1}^{n}+c_{2}\lambda_{2}^{n}$. 

高次递推方程形式类似, 可以通过同样的构造特征根的方式求得特征根. 

该推导方法必须要求没有重根, 若是存在重根, 则不可能对角化, 只能进行Jordan标准形化. 直接写结论$\sum\limits_{i=1}^{m} c_{i}\begin{pmatrix}n\\ i-1\end{pmatrix}\lambda^{n-i+1}_{0}$

# 相对一般的证明方法

1. 证明结论对于若当块成立；
2. 证明结论对于若当标准形成立；
3. 利用问题在相似下的不变性证明结论对于一般矩阵成立.

通过此方法可以证明著名的[[Jordan-Chevalley分解]]

$$
\left( \frac{a^{\alpha}+b^{\alpha}}{2} \right)^{1/\alpha}
$$