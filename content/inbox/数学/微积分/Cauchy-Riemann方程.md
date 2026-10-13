标签：[[数学]] [[复变函数]] [[公式]]

具体来说，这是复变函数定义导致的必然结果。

我们知道，实函数中要求的可微性质不难，并且这个要求实际上是弱的。函数哪怕一阶可微，二阶三阶也不一定可微。这是因为，实函数的自变量只有一个数轴，数轴方向局限了可微的条件。

而在复函数中，这个条件实际上是强的。因为众所周知，复变函数有两个变量，因此我们要求它从任何方向逼近时，都能满足可微的条件。此外，复数还满足一个神秘的条件$i^{2}=-1$。

因此对于任意的方向来说，都必须满足以下这个可微的条件
$$
f'(z_0) = \lim_{\Delta z \to 0} \frac{f(z_0 + \Delta z) - f(z_0)}{\Delta z}
$$
由于是复数变换，因此对任意一个点$x+iy$，都需要去乘一个复数$a+bi$。因此有
$$
f(x+iy) = (ax-by) + i(ay+bx)
$$
即
$$
f(x+iy) = \begin{pmatrix}
a & -b \\
b & a
\end{pmatrix}
\begin{pmatrix}
\Delta x \\
\Delta y
\end{pmatrix}
$$
而这个刚好和多元实函数Taylor展开的[[Jacobi行列式]]相呼应，因此有
$$
\begin{pmatrix}
\frac{ \partial u }{ \partial x }  & \frac{ \partial u }{ \partial y }  \\
\frac{ \partial v }{ \partial x }  & \frac{ \partial v }{ \partial y } 
\end{pmatrix} = 
\begin{pmatrix}
a & -b \\
b & a
\end{pmatrix}
$$
把他们依次对应，我们就得到了Cauchy-Riemann方程：
$$
\begin{cases}
\frac{ \partial u }{ \partial x } = \frac{ \partial v }{ \partial y }  \\
\frac{ \partial u }{ \partial y } = -\frac{ \partial v }{ \partial x } 
\end{cases}
$$
