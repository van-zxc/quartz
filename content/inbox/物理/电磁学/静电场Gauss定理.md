标签：[[物理]] [[公式]] [[电磁学]] [[静电场]]

### 电场线：

**电场线的每一点的切线方向都和该位置的场强方向相同**，实际上电场构成了一个[[场|矢量场]]（空间坐标的矢量函数 在一定空间范围内连续分布）

# 积分形式

电场==有源==→静电场的高斯定理

类比流体：考虑定义通过某个面元的电通量$d\vec{F} = \vec{E} \cdot\mathrm{d}\vec{S}$（面积有方向 因此要加矢量）

高斯定理(积分形式)：
$$
\Phi_e = \newcommand{\oiint}{{\subset\!\supset} \mathllap{\iint}}{\oiint} \mathbf{\vec{E}} \cdot \mathrm{d}\mathbf{\vec{S}} = \frac{1}{\varepsilon_0}\sum q_i = \frac{1}{\varepsilon_0} \iiint \rho \mathrm{d}V
$$
证明思路：先证明在球面正中通过的电通量为定值， 然后在在外面构造任意曲面 证明投影后球面可以完全映射到外面的曲面， 然后根据电场叠加原理得出可以代数相加。最后证明在外侧积分为0

注意事项：
1. 告诉我们场和源的代数关系（构造高斯面）
2. 静电力的平方反比定律, 与电量呈正比的定律以及可叠加性. 
3. 此外场强实际上是内外作用的共同结果, 但是此处公式的右边只包括闭合曲面内部的电荷 ! 
4. 需要电荷的分布, 还需要知道高斯面上所有点的场强和$\theta$. 也就是说, 要能够统一到一个只有E的方程上. 这要求物理图像具有很强的对称性. 如果无法求解, 可以尝试使用场强叠加效应恢复物体的对称性再使用. 

应用：静电条件下 导体加入额外电荷 电荷一定分布在表面（选取内部任意曲面 均无电场 也就是说均无电荷）

**当我们将积分的体积无限缩小……微分形式的高斯定理！**

# 微分形式的高斯定理

假设我们把我们假设的高斯面切两半，由于中间面的电通量相互抵消，所以总通量为上通量加下通量。由此类推：

此处参见散度的条目: 
![[散度#笛卡尔坐标系下的散度]]

根据场Gauss的形式, 我们可以将之前的积分转换为下面的形式: 
$$
\newcommand{\oiint}{{\subset\!\supset} \mathllap{\iint}}{\oiint} \mathbf{\vec{E}} \cdot \mathrm{d} \mathbf{\vec{S}} = \iiint_{V} (\nabla \cdot \mathbf{\vec{E}}) \cdot \mathrm{d} V
$$

再根据我们之前已经求出来的Gauss公式的形式
$$
\newcommand{\oiint}{{\subset\!\supset} \mathllap{\iint}}{\oiint} \mathbf{\vec{E}} \cdot \mathrm{d}\mathbf{\vec{S}} = \frac{1}{\varepsilon_0} \iiint \rho \mathrm{d}V
$$
可以观察出来积分号之内的东西都是相同的, 所以可以得出以下公式: 
$$
\nabla \cdot \mathbf{\vec{E}} = \frac{\rho}{\varepsilon_0}
$$
这个就是==微分形式的静电场Gauss定理.==

通过这个定理, 我们一旦得知了某一点的场, 那么就一定可以通过对这个点的场求散度从而得知该点的电荷密度$\rho$


# 电介质的gauss定理修正

对于电介质，静电场Gauss定理存在修正：

假设构造垂直于导体和电介质交界平面的高斯面（圆柱），那么
$$
高斯面内的电荷Q = (\sigma-\sigma_i)S
$$
$$
由静电场Gauss定理：ES = \frac{(\sigma-\sigma_i)S}{\varepsilon_0}
$$
$$
带入\sigma_i-\sigma = \frac{\sigma}{\varepsilon_r}
$$
$$
可以得到：\varepsilon_r ES = \frac{\sigma S}{\varepsilon_0}
$$
把每一个小面积分可以得到：
$$
\oiint (\varepsilon_r \mathbf{\vec{E}}) \cdot \mathrm{d} \mathbf{\vec{S}} = \frac{Q_{自由}}{\varepsilon_0}
$$
结论就是通过把E变成$\varepsilon_0 E$来修正高斯定理 [[极化]]
